var FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
var IMAGE_TYPES = JslibHtml5CameraPhoto.IMAGE_TYPES;

// get video and image elements
var videoElement = document.getElementById('videoId');
var imgElement = document.getElementById('imgId');


// get select and buttons elements
var facingModeSelectElement =
    document.getElementById('facingModeSelectId');
var startCameraDefaultAllButtonElement =
    document.getElementById('startDefaultAllButtonId');
var startDefaultResolutionButtonElement =
    document.getElementById('startDefaultResolutionButtonId');
var startMaxResolutionButtonElement =
    document.getElementById('startMaxResolutionId');
var takePhotoButtonElement =
    document.getElementById('takePhotoButtonId');
var stopCameraButtonElement =
    document.getElementById('stopCameraButtonId');
var cameraSettingElement =
    document.getElementById('cameraSettingsId');
var showInputVideoDeviceInfosButtonElement =
  document.getElementById('showInputVideoDeviceInfosButtonId');
var inputVideoDeviceInfosElement =
    document.getElementById('inputVideoDeviceInfosId');

// instantiate JslibHtml5CameraPhoto with the videoElement
var cameraPhoto = new JslibHtml5CameraPhoto.default(videoElement);

function startCameraDefaultAll () {
    var facingMode = facingModeSelectElement.value;
    var idealResolution = { width: 320, height: 320 };
     cameraPhoto.startCamera(FACING_MODES[facingMode], idealResolution)
    .then(() => {
      var log = `Camera started with default All`;
      console.log(log);
     
    })
    .catch((error) => {
      console.error('Camera not started!', error);
    });
}

// start the camera with prefered environment facingMode ie. ()
// if the environment facingMode is not avalible, it will fallback
// to the default camera avalible.
function startCameraDefaultResolution () {
  var facingMode = facingModeSelectElement.value;
 var idealResolution = { width: 320, height: 320 };
  cameraPhoto.startCamera(FACING_MODES[facingMode], idealResolution)
    .then(() => {
      var log =
          `Camera started with default resolution and ` +
          `prefered facingMode : ${facingMode}`;
      console.log(log);
    })
    .catch((error) => {
      console.error('Camera not started!', error);
    });
}

// function called by the buttons.
function takePhoto () {
  var sizeFactor = 1;
  var imageType = IMAGE_TYPES.JPG;
  var imageCompression = 1;

  var config = {
    sizeFactor,
    imageType,
    imageCompression
  };

  var dataUri = cameraPhoto.getDataUri(config);
  imgElement.src = dataUri;
}

function showCameraSettings () {
  var settings = cameraPhoto.getCameraSettings();

  // by default is no camera...
  var innerHTML = 'No camera';
  if (settings) {
    var {aspectRatio, frameRate, height, width} = settings;
    innerHTML = `
        aspectRatio:${aspectRatio}
        frameRate: ${frameRate}
        height: ${height}
        width: ${width}
    `;
  }
  cameraSettingElement.innerHTML = innerHTML;
}

function showInputVideoDeviceInfos () {
  var inputVideoDeviceInfos = cameraPhoto.getInputVideoDeviceInfos();

  // by default is no inputVideoDeviceInfo...
  var innerHTML = 'No inputVideoDeviceInfo';
  if (inputVideoDeviceInfos) {
    innerHTML = '';
    inputVideoDeviceInfos.forEach((inputVideoDeviceInfo) => {
      var {kind, label, deviceId} = inputVideoDeviceInfo;
      var inputVideoDeviceInfoHTML = `
            kind: ${kind}
            label: ${label}
            deviceId: ${deviceId}
            <br/>
        `;
      innerHTML += inputVideoDeviceInfoHTML;
    });
  }
  inputVideoDeviceInfosElement.innerHTML = innerHTML;
}

function stopCamera () {
  cameraPhoto.stopCamera()
    .then(() => {
      console.log('Camera stoped!');
    })
    .catch((error) => {
      console.log('No camera to stop!:', error);
    });
}

function startCameraMaxResolution () {
  var facingMode = facingModeSelectElement.value;
  cameraPhoto.startCameraMaxResolution(FACING_MODES[facingMode], {width: 640, height: 480})
    .then(() => {
      var log =
          `Camera started with maximum resoluton and ` +
          `prefered facingMode : ${facingMode}`;
      console.log(log);
    })
    .catch((error) => {
      console.error('Camera not started!', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // update camera setting
  setInterval(() => {
    showCameraSettings();
  }, 500);

  // bind the buttons to the right functions.
  startCameraDefaultAllButtonElement.onclick = startCameraDefaultAll;
  startDefaultResolutionButtonElement.onclick = startCameraDefaultResolution;
  startMaxResolutionButtonElement.onclick = startCameraMaxResolution;
  takePhotoButtonElement.onclick = takePhoto;
  stopCameraButtonElement.onclick = stopCamera;
  showInputVideoDeviceInfosButtonElement.onclick = showInputVideoDeviceInfos;
});



let btn_scan = document.getElementById('scan-btn');
let mainpage = document.querySelector('.slider-main-wrappper');
let slidermain = document.querySelector('.slider-body');
let spinnermain=document.querySelector('.spinner-container');
let centbody=document.querySelector('.center-body');
let successbody=document.querySelector('.success-page');
let nav = document.querySelector('nav');
let spannum = document.querySelectorAll('.step-no');
let stepcontainer=document.querySelectorAll('.step-container');
let successimg=document.getElementById('successimg');
const elem = document.getElementsByTagName('html')[0];
let fullscreen = document.getElementById('full');
var vid_track;
const video = document.getElementById("video")
const resultContainer = document.getElementById('result')



let slidecontainer = document.querySelectorAll('.slide-container');

btn_scan.addEventListener('click', async () => {
    // fullscreen.click();
    var panel='first-panel';
    mainpage.style.display = 'none';
    spinnermain.style.display="flex";
    setInterval(() => {
        spinnermain.style.opacity="0";
     
     
    }, 2000);
    setInterval(() => {
        spinnermain.style.width="0";
         
     
    }, 3000);
    slidermain.style.display = 'flex';

    slidecontainer.forEach(element => {
        if(panel==element.id){
            // console.log(element.id)
            element.classList.remove('hide-slider');
        }
        else{
            element.classList.add('hide-slider');
        }
    });

    // FOR QR CODE
    startCameraDefaultAll();
    decodeQR(videoElement);

    // disbale sleep
    preventSleep(true);

    //END
})

const canWakeLock = () => 'wakeLock' in navigator;
let wakelock;
async function lockWakeState() {
    if(!canWakeLock()) return;
    try {
      wakelock = await navigator.wakeLock.request();
      wakelock.addEventListener('release', () => {
        console.log('Screen Wake State Locked:', !wakelock.released);
      });
      console.log('Screen Wake State Locked:', !wakelock.released);
    } catch(e) {
      console.error('Failed to lock wake state with reason:', e.message);
    }
  }
async function preventSleep(allow) {
    if (allow === false) {
        if(wakelock) wakelock.release();
        wakelock = null;
    }
    else if (allow === true) {
        await lockWakeState();
        // setTimeout(preventSleep(false), 50); // release wake state after 5 seconds
    }
}

function page(e) {
    var pagenum = e.id;
    // console.log(pagenum)
    switch (pagenum) {
        case '1':
            var panel='first-panel';
    
            for (let i = 0; i < spannum.length; i++) {
                spannum[0].innerText='1'
                spannum[1].innerText='2'
                spannum[2].innerText='3'
                if (spannum[i].textContent == '1') {
                    spannum[i].classList.add('active')
                    spannum[i].classList.remove('done')
                }
                else {
                    spannum[i].classList.remove('active')
                    spannum[i].classList.remove('done')
     
                }
       
            }
            slidecontainer.forEach(element => {
                if(panel==element.id){
                    element.classList.remove('hide-slider');
                }
                else{
                    element.classList.add('hide-slider');
                }
            });
            stepcontainer.forEach(element => {
            element.classList.remove('act');
          });

            break;
        case '2':
            var panel='second-panel';
            for (let i = 0; i < spannum.length; i++) {
                spannum[1].innerText='2'
                spannum[2].innerText='3'
                if (spannum[i].textContent == '2') {
                    spannum[i].classList.add('active')
                    spannum[i].classList.remove('done')
                    spannum[0].classList.add('done') 
                    spannum[0].innerText='✔'
                }
                else {
                    spannum[i].classList.remove('active')
                    spannum[i].classList.remove('done')
                }
            }
            slidecontainer.forEach(element => {
                if(panel==element.id){
                    element.classList.remove('hide-slider');
                }
                else{
                    element.classList.add('hide-slider');
                }
            });
           
            for (let i = 0; i < stepcontainer.length; i++) {
                    stepcontainer[1].classList.add('act')   
                    stepcontainer[i].classList.remove('act')
            }
            vid_track.stop()
            runcamera();
            break;
        case '3':
            var panel='third-panel';
            for (let i = 0; i < spannum.length; i++) {
                spannum[2].innerText='3'
          
                    spannum[i].classList.add('done')
                    spannum[i].innerText='✔'
                
            }
            slidecontainer.forEach(element => {
                if(panel==element.id){
                    element.classList.remove('hide-slider');
                }
                else{
                    element.classList.add('hide-slider');
                }
            });
            for (let i = 0; i < stepcontainer.length; i++) {
                stepcontainer[i].classList.add('act')   
        }
            centbody.style.display="flex";
            setInterval(() => {
                centbody.style.display="none";
            }, 2000);    
            setInterval(() => {
                successbody.style.opacity='1';
                successimg.style.display='flex';
            }, 2000); 
            // setInterval(() => {

            //     location.reload();
             
             
            // }, 4000); 

            break;
        default:
            break;
    }
}  

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

  
  