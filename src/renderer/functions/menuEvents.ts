import $ from 'jquery';
import { renderDeploymentList } from "./deploymentListBuilder";
import { renderCreateDeployment } from "./newDeploymentBuilder";
import { renderMainMenu, renderPrintMenu, renderChecklistMenu } from "./menuBuilder";
import { dbPromise } from '../data/db';
import { Deployment } from '../models/deployment';
import { updateDeployment, getItemsByDeploymentId } from './helpers/dbFunctions';
import { renderChecklist } from './checklistBuilder';
import { printToPdf, onPrintDone, exportData, onExportDone, openExternal } from './helpers/electronHelper';
import { showModal } from './modalBuilder';
import { renderPrintView } from './printViewBuilder';
import { renderImportDeployment } from './importDeploymentBuilder';
import { encryptDecryptData } from './helpers/encryptDecryptData';
import { renderHelpPage } from './helpBuilder';


//MAIN MENU EVENTS

export const loadMainMenuEvents = () => {

    $('#menu_deployment-list').click(() => renderDeploymentList()); 
    $('#menu_new-deployment').click(() => renderCreateDeployment()); 
    $('#menu_deployment-import').click(() => renderImportDeployment());
    $('#menu_about').click(() => renderHelpPage());
    
    feedbackEvent(); 
    highlightSelectedMenuItems();
}

//PRINT MENU EVENTS

export const loadPrintMenuEvents = (id:string, context:String) => {
    
    //make sure the back button takes you back to the correct previous screen
    switch (context) {
        case 'deploymentList':
                $('#topbar-return').click(() => {
                    renderDeploymentList();
                    renderMainMenu();
                    $('#menu_deployment-list').addClass('current-menu-item');
                });
        break;

        case 'checklist':
                $('#topbar-return').click(() => {
                    renderChecklist(id);
                    renderChecklistMenu(id);
                    $('#menu_deployment-list').addClass('current-menu-item');
                });
    }

    //when clicking print to pdf, send a print to pdf command to execute in the main process
    $('#print-pdf').click(() => {
            const title = document.getElementById('pdf-title').innerHTML;
            printToPdf(title);
    });

    //open print options modal on Options click
    $('#print-settings').on('click', () => { 
        showModal(id, 'print-options');
    });

    //when print event signals completion, remove the highlight from Print to PDF menu option
    onPrintDone(() => {
        $('#print-pdf').removeClass('current-menu-item');
    });

    feedbackEvent(); 
    highlightSelectedMenuItems();
}

//CHECKLIST MENU EVENTS

export const loadChecklistMenuEvents = async (deployment:Deployment) => {
    
    //get id from deployment passed into function 
    const id = deployment.id.toString(); 

    //select the current phase in the checklist menu
    $('.menu-list').find(`[data-id='${deployment.currentPhaseId}']`).addClass('current-menu-item');

    //upon clicking the back button, load the deployment list and render main mainu
    $('#topbar-return').click(() => {
        renderDeploymentList();
        renderMainMenu();
        $('#menu_deployment-list').addClass('current-menu-item'); //select 'load deployment' on the menu 
    });

    //when clicking a phase on the checklist menu, update the deployment's currentPhaseId and re-render the checklist
    $('.menu-phase').click(async function() {
        const phaseId = $(this).data('id'); //get the phaseId data from the item you clicked
        deployment = {
            id: deployment.id, 
            dateCreated: deployment.dateCreated,
            dateModified: deployment.dateModified,
            name: deployment.name,
            currentPhaseId: phaseId, //update phaseId
            integrator: deployment.integrator,
            productTier: deployment.productTier,
            headerImage: deployment.headerImage,
            printSignoff: deployment.printSignoff
        }
        dbPromise()
            .then(async db => {
                await updateDeployment(deployment, db);
                await renderChecklist(id); 
            })
    });

    //show the edit moadal when clicking the edit details button and pass in the checklist context
    $('#menu-edit').click(async function(){
        await showModal(id, "edit", "checklist");
    });

    $('#menu-export').click(async function(){
        await exportDeploymentData(deployment);
    })

    $('#menu-print').click(async function() {
        await renderPrintView(id); 
        await renderPrintMenu(id, "checklist"); 
    })

    feedbackEvent(); 
    highlightSelectedMenuItems();
}

const highlightSelectedMenuItems = () => {

    //toggle the selected class on menu items
    $('.menu-item').click(function(){
        $(this).siblings('.current-menu-item').removeClass('current-menu-item');
        $(this).addClass('current-menu-item');
    });
}

export const exportDeploymentData = async (deployment:Deployment) => {

    const itemData = await generateItemDataForExport(deployment.id.toString());
    const exportName = `${deployment.name} (Import)`

    let data = `
        { "deployment":
            {
                "name": ${JSON.stringify(exportName)},
                "productTier": ${JSON.stringify(deployment.productTier)},
                "integrator": ${JSON.stringify(deployment.integrator)},
                "currentPhaseId": ${JSON.stringify(deployment.currentPhaseId)},
                "dateCreated": ${JSON.stringify(deployment.dateCreated)},
                "dateModified": ${JSON.stringify(deployment.dateModified)},
                "printSignoff":  ${JSON.stringify(deployment.printSignoff)},
                "headerImage":  ${deployment.headerImage == null ? null : JSON.stringify(deployment.headerImage)}
            },

        "deploymentItems": [
                ${itemData}
            ]
        }
    `

    //debug
    //console.log(data);

    const encryptedData = encryptDecryptData(data, 'encrypt'); 
    exportData(encryptedData, deployment.name);
    onExportDone(() => {
        if($('#checklist-menu')){
            $('.menu-item').removeClass('current-menu-item');
            $('.menu-list').find(`[data-id='${deployment.currentPhaseId}']`).addClass('current-menu-item');
        }
    });
    
}

const generateItemDataForExport = (id:string) => {
       
    return dbPromise().then(async db => {
       
        let itemData = '';
        const items = await getItemsByDeploymentId(id, db); 
        
        items.forEach((item, index, array) => {
            itemData += `
                {
                    "stepId": ${JSON.stringify(item.stepId)},
                    "itemState": ${JSON.stringify(item.itemState)},
                    "integrator": ${item.integrator == null ? null : JSON.stringify(item.integrator)},
                    "date": ${item.date == null ? null : JSON.stringify(item.date)},
                    "note": ${item.note == null ? null : JSON.stringify(item.note)},
                    "noteDate": ${item.noteDate == null ? null : JSON.stringify(item.noteDate)},
                    "noteIntegrator": ${item.noteIntegrator == null ? null : JSON.stringify(item.noteIntegrator)}
                }${index === (array.length - 1) ? '' : ','}
            `
        })
        return itemData;
    })
}

const feedbackEvent = () => {

    $('#menu_feedback').on('click', function(){
        openExternal('mailto:deploymentfeedback@milestone.dk?subject=Milestone%20Deployment%20Assistant%20Feedback');
    })

}