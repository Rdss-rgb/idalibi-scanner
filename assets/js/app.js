"use strict";

var FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
var IMAGE_TYPES = JslibHtml5CameraPhoto.IMAGE_TYPES;

// get video and image elements
var videoElement = document.getElementById('videoId');
var imgElement = document.getElementById('imgId');


let videoWidth, videoHeight;
let qvga = { width: { exact: 320 }, height: { exact: 240 } };
let vga = { width: { exact: 640 }, height: { exact: 480 } };
// let vga = {width: {exact: 640}, height: {exact: 480}};
let resolution = window.innerWidth < 640 ? qvga : vga;
// whether streaming video from the camera.
let streaming = false;

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

function startCameraDefaultAll() {
  console.log("facingModeSelectElement.value", facingModeSelectElement.value);
  var facingMode = facingModeSelectElement.value;
  var idealResolution = { width: 320, height: 320 };
  console.log("FACING_MODES[facingMode]", FACING_MODES[facingMode]);
  cameraPhoto.startCamera(FACING_MODES[facingMode], idealResolution)
    .then(() => {
      var log = `Camera started with default All`;
      console.log(log);
      runcamera1();

    })
    .catch((error) => {
      console.error('Camera not started!', error);
    });
}


var canvasqr = document.getElementById("canvasqr");
var canvasqrCtx = canvasqr.getContext("2d");
var size = 350;
let maskImg1;
let canvasqrInput = null;
let canvasqrInputCtx = null;

async function runcamera1() {
  canvasqr.width = size;
  canvasqr.height = size;
  var canvasqrInput = document.createElement('canvas');
  canvasqrInput.width = videoWidth;
  canvasqrInput.height = videoHeight;
  var canvasqrInputCtx = canvasqr.getContext('2d');

  // Draw the rectangle
  canvasqrInputCtx.fillStyle = 'rgb(0 0 0 / 50%)';
  canvasqrInputCtx.fillRect(0, 0, size, size);

  canvasqrInputCtx.globalCompositeOperation = 'destination-out';     // Set the global composite operation to 'destination-out' to clear the oval area
  canvasqrInputCtx.fillStyle = 'rgba(255,255,255,1.0)';
  canvasqrInputCtx.fillRect(80, 80, 200, 200);
  canvasqrInputCtx.fill();
  canvasqrInputCtx.globalCompositeOperation = 'source-over';         // Restore the canvas state to remove the global composite operation

  canvasqrInputCtx.strokeStyle = "rgb(38 169 225)";
  canvasqrInputCtx.lineWidth = 3;
  canvasqrInputCtx.rect(80, 80, 200, 200);
  canvasqrInputCtx.stroke();

  let mask1 = canvasqr.toDataURL();
  maskImg1 = document.createElement("img");
  maskImg1.src = mask1;
  canvasqrInputCtx.restore();
  canvasqrInputCtx.globalCompositeOperation = 'source-over';
  setInterval(() => {
    draw1(canvasqrCtx, canvasqrInputCtx);
  }, 100);
}


function draw1(canvasqrCtx, canvasqrInputCtx) {
  if (videoElement != null) {
    // Save the current canvas state
    canvasqrInputCtx.save();
    var min = Math.min(videoElement.videoHeight, videoElement.videoWidth);
    var sx = (videoElement.videoWidth - min) / 2
    var sy = (videoElement.videoHeight - min) / 2
    canvasqrCtx.drawImage(videoElement, sx, sy, min, min, 0, 0, size, size);
    canvasqrCtx.drawImage(maskImg1, 0, 0);
  }
}


// start the camera with prefered environment facingMode ie. ()
// if the environment facingMode is not avalible, it will fallback
// to the default camera avalible.
function startCameraDefaultResolution() {
  // var facingMode = facingModeSelectElement.value;
  // var idealResolution = { width: 320, height: 320 };
  let deviceId = cameraInputs[selectedCameraIndex].deviceId;
  // cameraPhoto.startCamera(FACING_MODES[facingMode], idealResolution)
  videoElement.width = cameraInputs[selectedCameraIndex].getCapabilities().width.max;
  videoElement.height = cameraInputs[selectedCameraIndex].getCapabilities().height.max;
  cameraPhoto.startCamera(deviceId)
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
function takePhoto() {
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

function showCameraSettings() {
  var settings = cameraPhoto.getCameraSettings();
  // by default is no camera...
  var innerHTML = 'No camera';
  if (settings) {
    var { aspectRatio, frameRate, height, width } = settings;
    innerHTML = `
        aspectRatio:${aspectRatio}
        frameRate: ${frameRate}
        height: ${height}
        width: ${width}
    `;
  }
  cameraSettingElement.innerHTML = innerHTML;
}

function showInputVideoDeviceInfos() {
  var inputVideoDeviceInfos = cameraPhoto.getInputVideoDeviceInfos();

  // by default is no inputVideoDeviceInfo...
  var innerHTML = 'No inputVideoDeviceInfo';
  if (inputVideoDeviceInfos) {
    innerHTML = '';
    inputVideoDeviceInfos.forEach((inputVideoDeviceInfo) => {
      var { kind, label, deviceId } = inputVideoDeviceInfo;
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

function stopCamera() {
  cameraPhoto.stopCamera()
  .then(() => {
    console.log('Camera stoped!');
  })
  .catch((error) => {
    console.log('No camera to stop!:', error);
  });
}

function startCameraMaxResolution() {
  var facingMode = facingModeSelectElement.value;
  cameraPhoto.startCameraMaxResolution(FACING_MODES[facingMode], { width: 640, height: 480 })
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
let spinnermain = document.querySelector('.spinner-container');
let centbody = document.querySelector('.center-body');
let successbody = document.querySelector('.success-page');
let failbody = document.querySelector('.fail-page');
let nav = document.querySelector('nav');
let spannum = document.querySelectorAll('.step-no');
let stepcontainer = document.querySelectorAll('.step-container');
let successimg = document.getElementById('successimg');
let failimg = document.getElementById('failimg');
const elem = document.getElementsByTagName('html')[0];
let fullscreen = document.getElementById('full');
var vid_track;
const video = document.getElementById("video")
const resultContainer = document.getElementById('result')
let slidecontainer = document.querySelectorAll('.slide-container');

btn_scan.addEventListener('click', async () => {
  // fullscreen.click();
  var panel = 'first-panel';
  mainpage.style.display = 'none';
  spinnermain.style.display = "flex";
  setInterval(() => {
    spinnermain.style.opacity = "0";
  }, 2000);
  setInterval(() => {
    spinnermain.style.width = "0";
  }, 3000);
  slidermain.style.display = 'flex';
  slidecontainer.forEach(element => {
    if (panel == element.id) {
      element.classList.remove('hide-slider');
    }
    else {
      element.classList.add('hide-slider');
    }
  });
  // * FOR QR CODE
  startCameraDefaultAll();
  decodeQR(videoElement);

  // * Disbale sleep
  preventSleep(true);
  // * END
})

const canWakeLock = () => 'wakeLock' in navigator;
let wakelock;
async function lockWakeState() {
  if (!canWakeLock()) return;
  try {
    wakelock = await navigator.wakeLock.request();
    wakelock.addEventListener('release', () => {
      console.log('Screen Wake State Locked:', !wakelock.released);
    });
    console.log('Screen Wake State Locked:', !wakelock.released);
  } catch (e) {
    console.error('Failed to lock wake state with reason:', e.message);
  }
}
async function preventSleep(allow) {
  if (allow === false) {
    if (wakelock) wakelock.release();
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
      break;
    case '2':
      break;
    case '3':
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