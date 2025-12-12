import { renderMainMenu } from "./functions/menuBuilder";
import './css/app.css'
import { createStaticPath } from "./functions/helpers/createStaticPath";
import { getAppVersion } from "./functions/helpers/electronHelper";

//set release version here
export const releaseVersion:string = "XProtect VMS 2020 R3";

const myApp = document.getElementById('app');
myApp.innerHTML = `
    <div id="modal">
        <div id="modal-container">
            <span id="modal-close">&times;</span>
            <div id="modal-content">
            </div>
        </div>
    </div>
    <div id="topbar" class="topnav"></div>
    <div id="menu" class="sidenav"></div>
    <main id="main-content" class="container">
        <div id="splash-banner">
            <img id="splash-banner" src="${createStaticPath("./images/Deployment_banner_345.png")}">
        </div>
        <div id="splash-screen">
            <div id="splash-content">
                <span id="logo-container">
                    <svg id="milestone-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372.73 77.32">
                        <rect x="265.75" y="665.97" width="54.67" height="54.67" transform="translate(321.65 -658.83) rotate(45)"/>
                        <rect x="153.89" y="23.9" width="8.32" height="31.97"/>
                        <rect x="153.89" y="10.38" width="8.32" height="7.76"/>
                        <path d="M390,677.79a12.41,12.41,0,0,0-11.18,6.34c-1.12-4-4.72-6.34-9.07-6.34A12.08,12.08,0,0,0,359.1,684H359c0-1.61,0-5.45,0-5.45h-7.65v32h8.32V694.37c0-5.9,3-9.93,6.83-9.93,3.42,0,5.22,2.79,5.22,6.76v19.31h8.38V694.68c0-6.46,2.73-10.24,6.71-10.24,3.54,0,5.34,2.79,5.34,8.32v17.75h8.38V691.89C400.52,684,398,677.79,390,677.79Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M541.42,677.79c-10.24,0-17.07,6.46-17.07,16.77,0,9.93,6.89,16.7,16.82,16.7S558,704.62,558,694.62C558,684.44,551.17,677.79,541.42,677.79Zm-.31,27.14c-4.78,0-7.89-4-7.89-10.31,0-6.83,3-10.68,7.95-10.68s8.07,3.79,8.07,10.37S546.08,704.93,541.11,704.93Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M580.85,677.79a12.05,12.05,0,0,0-10.62,6.09h-.12v-5.33h-7.83v32h8.2V696.05a16.47,16.47,0,0,1,1.36-7.45,7.5,7.5,0,0,1,6.52-4.16c5.47,0,5.78,4.53,5.78,10.68v15.39h8.19V691.89C592.33,683.32,589.35,677.79,580.85,677.79Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M627.16,694.87c0-11.55-4.78-17.08-14-17.08-9.62,0-16,7-16,16.58,0,10.74,6.9,16.89,17.39,16.89a24.77,24.77,0,0,0,10.43-2.11l-.12-6.83a17.28,17.28,0,0,1-9.32,2.61c-5.77,0-9.74-3.17-9.87-8.08H627C627.09,696.42,627.16,695.36,627.16,694.87Zm-21.67-3.73c.43-5,3.66-7.45,7.32-7.45,4.1,0,6.71,2.24,6.71,7.45Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M470.45,694.87c0-11.55-4.79-17.08-14-17.08-9.62,0-16,7-16,16.58,0,10.74,6.9,16.89,17.39,16.89a24.77,24.77,0,0,0,10.43-2.11l-.12-6.83a17.28,17.28,0,0,1-9.32,2.61c-5.77,0-9.75-3.17-9.87-8.08h21.42C470.38,696.42,470.45,695.36,470.45,694.87Zm-21.67-3.73c.43-5,3.66-7.45,7.32-7.45,4.1,0,6.71,2.24,6.71,7.45Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M488.24,691.45c-4.53-1.49-5.83-2.23-5.83-4.41s2-3.35,4.84-3.35a17.68,17.68,0,0,1,7.42,1.71V679a23.94,23.94,0,0,0-7.79-1.18c-7.64,0-12.67,3.73-12.67,9.81,0,4.72,2.42,7.14,8.51,9.25,5.09,1.81,6.27,2.67,6.27,4.91s-2.42,3.41-5.22,3.41a21,21,0,0,1-8.74-2v6.68a27.81,27.81,0,0,0,9.18,1.46c7.76,0,13.1-3.6,13.1-10.18C497.31,695.61,493.89,693.32,488.24,691.45Z" transform="translate(-254.43 -654.65)"/>
                        <path d="M521.37,703.68a10.08,10.08,0,0,1-3,.5c-4,0-5-2.17-5-7V684.68H521v-6.13h-7.64V663l-7.82,7.82v7.71h-6.27v6.13h6.14v14.16c0,8.45,3.11,12,10.43,12a17.67,17.67,0,0,0,5.72-.81Z" transform="translate(-254.43 -654.65)"/>
                        <polygon points="171.82 16.69 171.82 55.87 180.15 55.87 180.15 8.37 171.82 16.69"/>
                        <rect x="265.75" y="665.97" width="54.67" height="54.67" transform="translate(321.65 -658.83) rotate(45)"/>
                    </svg>
                </span>
                <span id="splash-title">Deployment assistant</span>
            </div>
            <div id="release-version">${releaseVersion}</div>
            <div id="copyright">&copy; 2019 Milestone Systems, Inc.</div>
            <div id="build-version">Build version: ${getAppVersion()}</div>
        <div>
    </main>
`
renderMainMenu();