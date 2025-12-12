import { loadHelpEvents } from "./helpEvents";
import { scrollToTop } from "./helpers/scrollToTop";
import { createStaticPath } from "./helpers/createStaticPath";
import { releaseVersion } from "..";
import { getRemote } from "./helpers/electronHelper";

let copyrightDate = "2019-2021";

export const renderHelpPage = () => {

    scrollToTop(); 

    const main = document.getElementById('main-content');    
    main.innerHTML = `
        <div id="help-container">
            <h1 class="title"> About & help </h1>
            <span id="help_subhead">Select a topic from the list below.</span>
            <div class='help-topic'>
                <div class='topic-selector'>
                    <button class='checklist-item__expand' aria-label='Show topic' title='Show more information'>
                        <span class='line'></span>
                    </button>
                    <div class='help-topic__title'>Application purpose</div>
                </div>
                <div class='help-content'>
                    <p>Milestone Deployment Assistant is designed to assist technicians and engineers as they prepare, install, configure, and otherwise deploy Milestone ${releaseVersion} systems. The application provides an interactive deployment checklist that references and supplements Milestone manuals, guides, and whitepapers with practical advice and suggestions on how to best deploy XProtect VMS.</p>
                    <p>The tasks and steps included in this application target the Milestone Certified Integration Technician (MCIT) level. In other words, this application is appropriate for single-server to multi-server, medium-complexity installations.</p>
                    <p>Milestone Certified Integration Technicians and Engineers can use this application as a technical design and installation reference for the following tasks:</p>
                    <ul>
                        <li>Planning</li>
                        <li>Installing</li>
                        <li>Servicing</li>
                        <li>Expanding</li>
                    </ul>
                    <p>Further, this application allows you to print the deployment checklist you complete as a PDF for use during a Final Acceptance Test (FAT).</p>
                </div>
            </div>
            <div class='help-topic'>
                <div class='topic-selector'>
                    <button class='checklist-item__expand' aria-label='Show topic' title='Show more information'>
                        <span class='line'></span>
                    </button>
                    <div class='help-topic__title'>How to use this application</div>
                </div>
                <div class='help-content'>
                    <p>Select a "how-to" topic to jump to the relevant section.</p>
                    <ul id="howto__topic-list"> 
                        <li><a href='#howto__get-started'>How do I get started?</a></li>
                        <li><a href='#howto__use-checklist'>How do I use the checklist?</a></li>
                        <li><a href='#howto__save'>How do I save my work?</a></li>
                        <li><a href='#howto__load'>How do I load a deployment I was previously working on?</a></li>
                        <li><a href='#howto__edit-project'>How do I change the integrator, XProtect product, or the name for my deployment?</a></li>
                        <li><a href='#howto__print'>How do I print the checklist for a customer?</a></li>
                        <li><a href='#howto__delete'>How do I delete a deployment?</a></li>
                        <li><a href='#howto__export'>How do I share a deployment so another team member can work on it?</a></li>
                        <li><a href='#howto__import'>How do I import a deployment?</a></li>
                    </ul>
                    <div id="howto__get-started">
                        <h2 class="howto__header">How do I get started?</h2>
                        <p> To get started, select <strong>New deployment</strong> from the main menu. On the New deployment screen, you'll need to specify three things:</p>
                        <ol>
                            <li>The Milestone XProtect<sup>&reg;</sup> product you will be deploying.</li>
                            <li>The name of your deployment.</li>
                            <li>The name of the integrator working on the project.</li>
                        </ol>
                        <p>Once you fill out each of these fields, you can create the deployment. The deployment and integrator names can have a maximum of 50 characters. You can use letters, numbers, spaces, and the following special characters: <code>-+.,()#!*@&?/'</code></p>
                        <p>If you need assistance selecting the appropriate XProtect product for your project, consult the Milestone Product Index at <a href="https://www.milestonesys.com/solutions/platform/product-index/">https://www.milestonesys.com/solutions/platform/product-index/</a>.</p>
                        <p>Once you select <strong>Create deployment</strong>, the assistant automatically takes you to the deployment checklist for the project you just created.</p>
                    </div>
                    <div id="howto__use-checklist">
                        <h2 class="howto__header">How do I use the checklist?</h2>
                        <p>The main section of the Milestone Deployment Assistant is the deployment checklist. Here, you'll be able to follow a step-by-step process to deploy a project. Each step in the checklist can be expanded to show additional information, best practices, and external resources to consult.</p>
                        <p>The deployment checklist is divided into four major phases:</p>
                        <ol>
                            <li>Preparing and Installing</li>
                            <li>Configuring and Organizing</li>
                            <li>Defining and Monitoring</li>
                            <li>Extending and Maintaining</li>
                        </ol>
                        <p>To navigate to the checklist for each phase, select the phase name on the side menu.</p>
                        <p>Each phase is comprised of multiple tasks with multiple steps. Depending on the XProtect product you selected, different tasks and steps appear.</p>
                        <p>You can interact with each step in several ways:</p>
                        <ul>
                            <li>
                                To complete a step, select the 
                                <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> 
                                <strong>checkbox</strong>.</span> The assistant records the integrator's name and current date along with the completion.
                            </li>
                            <li>
                                To show or hide additional information about a step, select the step title or 
                                <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> 
                                <strong>Show more information</strong>.</span> This also shows details about the step's completion status.
                            </li>
                            <li>
                                To record a note or comment, select 
                                <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM17 11h-4v4h-2v-4H7V9h4V5h2v4h4v2z"/></svg> 
                                <strong>Add note</strong>.</span> The assistant records the integrator's name and current date along with the note.
                            </li>
                            <li>
                                To specify that a given step doesn't apply to this particular deployment, select 
                                <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg> 
                                <strong>This step doesn't apply</strong>.</span>
                            </li>
                        </ul>
                       <p>
                            At any time, you can navigate back to the main menu by selecting 
                            <span class="help_icon-span"><svg id="help_back-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1 24"><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                            <strong>back</strong></span> on the top ribbon.
                        </p> 
                    </div>
                    <div id="howto__save">
                        <h2 class="howto__header">How do I save my work?</h2>
                        <p>The Milestone Deployment Assistant automatically saves your work as you go. No manual saving is required.</p>
                    </div>
                    <div id="howto__load">
                        <h2 class="howto__header">How do I load a deployment I was previously working on?</h2>
                        <p>To load a previous project, select <strong>Load deployment</strong> from the main menu. On the Load deployment screen, select the deployment you want to work on from the list. Deployments in the list appear in the order they were last modified.</p>
                    </div>
                    <div id="howto__edit-project">
                        <h2 class="howto__header">How do I change the integrator, XProtect product, or the name for my deployment?</h2>
                        <p>
                            You can change the details of your deployment from both the Load deployment screen and the deployment checklist. 
                            On the Load deployment screen, select 
                            <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="none" d="M0 0h20v20H0V0z"/><path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg> 
                            <strong>Edit</strong></span> for the deployment you want to change. On the deployment checklist, select <strong>Edit details</strong> from the side menu in the Actions list.
                        </p>
                        <p class="Notetext"><strong>Note:</strong> if you change the XProtect product, more steps may appear in sections you already completed.</p>
                        <p class="Notetext"><strong>Note:</strong> if you change the integrator name on the project, the new integrator name will not retroactively apply to steps and notes that were completed by a previous integrator.</p>
                    </div>
                    <div id="howto__print">
                        <h2 class="howto__header">How do I print the checklist for a customer?</h2>
                        <p>
                            You can create a PDF version of the checklist for reference and customer signoff from both the Load deployment screen and deployment checklist. 
                            On the Load deployment screen, select 
                            <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/><path d="M0 0h24v24H0z" fill="none"/></svg> 
                            <strong>Print</strong>.</span> On the deployment checklist, select <strong>Print view</strong> from the side menu in the Actions list.</p>
                        <p>The print view screen shows an approximation of what the PDF will look like. To convert the checklist to PDF, select <strong>Print to PDF</strong> from the side menu.</p>
                        <p class="Notetext"><strong>Note:</strong> You must have Adobe Acrobat or Adobe Reader installed to convert the checklist to PDF.</p>
                        <p>You can modify the PDF output by selecting <strong>Options</strong> from the side menu. In the Options window, you can upload your own custom logo for the print header and specify whether or not to include an optional customer sign-off page.</p>
                    </div>
                    <div id="howto__delete">
                        <h2 class="howto__header">How do I delete a deployment?</h2>
                        <p>
                            You can delete a deployment from the Load deployment screen by selecting 
                            <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/><path fill="none" d="M0 0h24v24H0z"/></svg> 
                            <strong>Delete</strong></span> on the deployment you want to delete.</p>
                    </div>
                    <div id="howto__export">
                        <h2 class="howto__header">How do I share a deployment so another team member can work on it?</h2>
                        <p>
                        To export your deployment in order to share it with other team members that have the Milestone Deployment Assistant, select <strong>Export data</strong> from the deployment checklist menu in the Actions list, or select 
                        <span class="help_icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/><path fill="none" d="M0 0h24v24H0z"/></svg> 
                        <strong>Export</strong></span> for the deployment you want to export on the Load deployment screen.</p> 
                        <p>Once you specify the location where you want to save the data, your deployment will be saved as an encrypted Milestone Deployment Data (.mddata) file.</p>
                    </div>
                    <div id="howto__import">
                        <h2 class="howto__header">How do I import a deployment?</h2>
                        <p>If you have a Milestone Deployment Data (.mddata) file you'd like to import, you can do so by selecting <strong>Import deployment</strong> from the main menu.</p>
                        <p>Select <strong>Browse</strong> to locate the .mddata file you want to import, then select <strong>Import deployment</strong>. When the import completes, you'll receive a confirmation message.</p>
                        <p>Once the deployment successfully imports, you can find it in the deployment list on the Load deployment screen.</p>
                    </div>
                </div>
            </div>
            <div class='help-topic'>
                <div class='topic-selector'>
                    <button class='checklist-item__expand' aria-label='Show topic' title='Show more information'>
                        <span class='line'></span>
                    </button>
                    <div class='help-topic__title'>Accessing additional resources</div>
                </div>
                <div class='help-content'>
                    <div>
                        <p>The task descriptions in this application are intended to be brief yet comprehensive. To accomplish this, most tasks include a list of additional resources for more in-depth information and background.</p>
                        <p>There are four categories of additional resources: </p>
                        <ul>
                            <li>Milestone manuals and guides</li>
                            <li>Milestone whitepapers and other Milestone documents</li>
                            <li>Milestone eLearning courses</li>
                            <li>Non-Milestone resources</li>
                        </ul>
                        <p>Refer to the descriptions below for details on how to access each of these resources.</p>        
                    </div>
                    <div class='help-resource-heading'>A. Milestone Manuals and Guides</div>
                    <div class='info' include-html="${createStaticPath('./info_content/Milestone manuals and guides.html')}"></div>
                    <div class='help-resource-heading'>B. Milestone whitepapers and other Milestone documents</div>
                    <div class='info' include-html="${createStaticPath('./info_content/Milestone whitepapers and other Milestone documents.html')}"></div>
                    <div class='help-resource-heading'>C. Milestone eLearning courses</div>
                    <div class='info' include-html="${createStaticPath('./info_content/Milestone eLearning courses.html')}"></div>
                    <div class='help-resource-heading'>D. Non-Milestone resources</div>
                    <div class='info' include-html="${createStaticPath('./info_content/Non-Milestone resources.html')}"></div>
                </div>
            </div>
            <div class='help-topic'>
                <div class='topic-selector'>
                    <button class='checklist-item__expand' aria-label='Show topic' title='Show more information'>
                        <span class='line'></span>
                    </button>
                    <div class='help-topic__title'>About this application</div>
                </div>
                <div class='help-content last-help-item'>
                    <div>
                        <h3>Milestone Deployment Assistant</h3>
                        <p>Build version: ${getRemote()?.app.getVersion() ?? 'unknown'}</p>
                        <p>&copy; ${copyrightDate} Milestone Systems, Inc. All rights reserved.</p></br>
                        <p>Milestone Deployment Assistant is made possible by <a href="https://nodejs.org/en/">Node.js</a> and the following open source software:</p>
                        
                        <div class="dependency">
                            <div class="dependency-name"> 
                                @types/jquery
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="types-jquery.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jquery">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                cssnano
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="cssnano.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/cssnano/cssnano">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                electron
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="electron.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/electron/electron">view homepage</a>
                                </span>
                            </div>
                        </div>
                        
                        <div class="dependency">
                            <div class="dependency-name"> 
                                electron-builder
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="electron-builder.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/electron-userland/electron-builder">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                electron-webpack
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="electron-webpack.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/electron-userland/electron-webpack">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                electron-webpack-ts
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="electron-webpack-ts.txt"> 
                                view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/electron-userland/electron-webpack/tree/master/packages/electron-webpack-ts">view homepage</a>
                                </span>
                            </div>
                        </div>
                        
                        <div class="dependency">
                            <div class="dependency-name"> 
                                idb
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="idb.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/jakearchibald/idb">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                jquery
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="jquery.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/jquery/jquery">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                js-yaml
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="js-yaml.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/nodeca/js-yaml">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                postcss-svgo
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="postcss-svgo.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/ben-eb/postcss-svgo">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                source-map-support
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="source-map-support.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/evanw/node-source-map-support">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                svgo
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="svgo.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/svg/svgo">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                typescript
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="typescript.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/microsoft/TypeScript">view homepage</a>
                                </span>
                            </div>
                        </div>

                        <div class="dependency">
                            <div class="dependency-name"> 
                                webpack
                            </div>
                            <div class="dependency-info">
                                <span class="view-license" file="webpack.txt"> 
                                    view license
                                </span> |
                                <span class="dependency-homepage">
                                    <a href="https://github.com/webpack/webpack">view homepage</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
        </div>
    `
    loadHelpEvents();
} 