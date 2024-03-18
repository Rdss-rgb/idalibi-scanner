//qr sacanner
function decodeOnce(codeReader, selectedDeviceId) {
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log(result)

        document.querySelector('.result-container').style.display = 'flex';
        document.getElementById('result').textContent = result.text
    }).catch((err) => {
        console.error(err)
        document.getElementById('result').textContent = err
    })
}


var camera = document.querySelector('#cameraswitch');
let cameraInputs = [];
var selectedCameraIndex = -1;
var defaultCamera = "environment"; //"environment" or "user";



window.addEventListener('load', function () {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            console.log(devices)
            devices.forEach((v, k) => {
                // alert("kind " + v.kind)
                if (v.kind == "videoinput") {
                    console.log("V: ", v.getCapabilities().facingMode)
                    console.log("Cameras: ", cameraInputs)
                    // alert("facingMode" + getCapabilities().facingMode);
                    if (v.getCapabilities().facingMode.findIndex((element) => element == defaultCamera) != -1) {
                        dropdown.selected = true;
                        sourceSelect.value = dropdown.value;
                        selectedCameraIndex = cameraInputs.length - 1;
                        localStorage.setItem("deviceID", cameraInputs[selectedCameraIndex]);
                    }
                }
            });
            // alert ("selectedCameraIndex " + selectedCameraIndex);
            // alert ("cameraInputs.length " + cameraInputs.length);
            console.log(cameraInputs);
            if (cameraInputs.length <= 1) {
                camera.style.display = 'none';
                videoElement.style.transform = "scale(-1,1)";
            } else {

            }
        })
        
    // If there is a camera but it doesn't match the requirment, select it
    if (cameraInputs.length > 0 && selectedCameraIndex == -1) {
        selectedCameraIndex = 0;
        sourceSelect.value = cameraInputs[selectedCameraIndex];
        localStorage.setItem("deviceID", cameraInputs[selectedCameraIndex]);

    }
})

let sourceSelect = document.getElementById("facingModeSelectId")
let sourceSelectOptions = document.querySelectorAll("option")
sourceSelect.addEventListener('change', async function (e) {
    let sourceSelectOptions = document.querySelectorAll(".option")

    vid_track.stop()
    resultContainer.textContent = ""
    var savedID = localStorage.getItem("deviceID");
    var videoInput = "";
    videoInput = sourceSelect.value;
    // document.getElementById("test").innerHTML = `<p> video input:  ` + videoInput + `</p>`

    navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: { exact: sourceSelect.value },
            width: { min: 340, ideal: 640 },
            height: { min: 340, ideal: 640 },
        }
    }).then(function (stream) {
        video.srcObject = stream;
        localStream = stream;

        console.log(stream.getVideoTracks()[0].getCapabilities().frameRate)
        var track = stream.getVideoTracks()[0]

        track.applyConstraints({
            frameRate: stream.getVideoTracks()[0].getCapabilities().frameRate.max,
        })

        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
    });

    decodeQR(video);

})

async function decodeQR(vid) {
    const codeReader = new ZXing.BrowserQRCodeReader()
    try {
        const result = await codeReader.decodeFromVideo(vid)
        // console.log(result.text)
        // resultContainer.textContent = result.text;
        document.querySelector('.qr-body').style.opacity='0';
        
        setTimeout(() => {
            document.querySelector('.result-container').style.display = 'flex';
            document.querySelector('.result-container').style.opacity = '0';
            document.querySelector('.result-container').style.trasition = '500ms ease-out';
            setTimeout(() => {

                document.querySelector('.result-container').style.opacity = '1';
            }, 200);
                    stopCamera();
        }, 300);
        setTimeout(() => {
            var panel = 'second-panel';
            for (let i = 0; i < spannum.length; i++) {
                spannum[1].innerText = '2'
                spannum[2].innerText = '3'
                if (spannum[i].textContent == '2') {
                    spannum[i].classList.add('active')
                    spannum[i].classList.remove('done')
                    spannum[0].classList.add('done')
                    spannum[0].innerText = '✔'
                }
                else {
                    spannum[i].classList.remove('active')
                    spannum[i].classList.remove('done')
                }
            }
            slidecontainer.forEach(element => {
                if (panel == element.id) {
                    element.classList.remove('hide-slider');
                }
                else {
                    element.classList.add('hide-slider');
                }
            });

            for (let i = 0; i < stepcontainer.length; i++) {
                stepcontainer[1].classList.add('act')
                stepcontainer[i].classList.remove('act')
            }

            runcamera();

        }, 1500);
        preventSleep(true);


    } catch (err) {
        console.error(err)
        resultContainer.textContent = result.err
    }

}


var x = true;
camera.addEventListener('click', () => {
        if (x == true) {
            videoElement.style.transform = "scale(-1,1)";
            x = false;
            document.querySelector('#switch').style.display='flex';
            setTimeout(() => {
                switchcamera()  
            }, 500); 
        }
        else {
            videoElement.style.transform = "unset";
            x = true;
            document.querySelector('#switch').style.display='flex';
            setTimeout(() => {
                switchcamera()  
            }, 500);
        }


})
function switchcamera(){
    var selectElement = document.getElementById("facingModeSelectId");
    var selectedIndex = selectElement.selectedIndex;
    var nextIndex = selectedIndex === 0 ? 1 : 0; // Toggle between 0 and 1
    selectElement.selectedIndex = nextIndex;
    startCameraDefaultResolution()
    setTimeout(() => {
    document.querySelector('#switch').style.display='none';
    }, 800);
}


//for face camera

let videoWidth, videoHeight;
let qvga = { width: { exact: 320 }, height: { exact: 240 } };
let vga = { width: { exact: 640 }, height: { exact: 480 } };
// let vga = {width: {exact: 640}, height: {exact: 480}};
let resolution = window.innerWidth < 640 ? qvga : vga;
// whether streaming video from the camera.
let streaming = false;


var video1 = document.getElementById("vid");
var canvasOutput = document.getElementById("canvasOutput");
var canvasOutputCtx = canvasOutput.getContext("2d");
var size=350;
let maskImg;


async function runcamera(){
    canvasOutput.width=size;
    canvasOutput.style.transform = "scale(-1,1)";
    cameraInputs.height=size;
    await initializeface();
    var canvasInput = document.createElement('canvas');
    canvasInput.width = videoWidth;
    canvasInput.height = videoHeight;
    var canvasInputCtx = canvasOutput.getContext('2d');


    // Draw the rectangle
    canvasInputCtx.fillStyle = 'rgba(255,255,255,0.7)';
    canvasInputCtx.fillRect(0, 0, size, size);
    
    // Draw the oval

    // Define the oval parameters
    var centerX = size / 2;
    var centerY = size / 2;
    var radiusX = 95; // Adjust the radius along X-axis as needed
    var radiusY = 120; // Adjust the radius along Y-axis as needed

    canvasInputCtx.globalCompositeOperation = 'destination-out';     // Set the global composite operation to 'destination-out' to clear the oval area
    canvasInputCtx.fillStyle = 'rgba(255,255,255,1.0)';
    canvasInputCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    canvasInputCtx.fill();
    canvasInputCtx.globalCompositeOperation = 'source-over';         // Restore the canvas state to remove the global composite operation

    canvasInputCtx.strokeStyle = "rgb(38 169 225)";
    canvasInputCtx.lineWidth = 3;
    canvasInputCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    canvasInputCtx.stroke();

    let mask = canvasOutput.toDataURL();
    maskImg = document.createElement("img");
    maskImg.src = mask;
    canvasInputCtx.restore();
    canvasInputCtx.globalCompositeOperation = 'source-over';
    setInterval(() => {
        draw(canvasOutputCtx,canvasInputCtx);
    }, 100);
    
}


let src = null;
let canvasInput = null;
let canvasInputCtx = null;


function draw(canvasOutputCtx,canvasInputCtx) {
    if(video1!=null){
        // Save the current canvas state
        canvasInputCtx.save();
        var min = Math.min(video1.videoHeight, video1.videoWidth);
        var sx  =(video1.videoWidth-min)/2
        var sy  =(video1.videoHeight-min)/2
        canvasOutputCtx.drawImage(video1,sx,sy,min,min, 0, 0, size,size);
        canvasOutputCtx.drawImage(maskImg,0,0);
    }
    else {

    }
}



async function initializeface(){
         //    for face bio 
        await navigator.mediaDevices
         .getUserMedia({
             video: {
                 facingMode: "user",
                 width: { min: 340, ideal: 640 },
                 height: { min: 340, ideal: 640 },
             },
         })
         .then(function (stream) {
             video1.srcObject = stream;
             video1.style.transform = "scale(-1,1)";
             video1.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
             video1.play();

         });
         preventSleep(true);

     //END

}































// let videoWidth, videoHeight;
// let qvga = { width: { exact: 320 }, height: { exact: 240 } };
// let vga = { width: { exact: 640 }, height: { exact: 480 } };
// // let vga = {width: {exact: 640}, height: {exact: 480}};
// let resolution = window.innerWidth < 640 ? qvga : vga;
// // whether streaming video from the camera.
// let streaming = false;


// var video1 = document.getElementById("vid");
// var canvasOutput = document.getElementById("canvasOutput");
// var canvasOutputCtx = canvasOutput.getContext("2d");
// var size=350;



// function runcamera(){
//     let canvas1=document.getElementById('canvasOutput');
//     canvas1.width=size;
//     canvas1.style.transform = "scale(-1,1)";
//     cameraInputs.height=size;
//     initializeface();
//     var canvasInput = document.createElement('canvas');
//     canvasInput.width = videoWidth;
//     canvasInput.height = videoHeight;
//     var canvasInputCtx = canvasOutput.getContext('2d');
//     setInterval(() => {
//         draw(canvasOutputCtx,canvasInputCtx);
//     }, 100);
    
// }


// let src = null;


// let canvasInput = null;
// let canvasInputCtx = null;

// var mask = new Image();


// // Function to draw on canvas
// function draw(canvasOutputCtx) {
//     if (video1.readyState === video1.HAVE_ENOUGH_DATA) {
//         var min = Math.min(video1.videoHeight, video1.videoWidth);
//         var sx = (video1.videoWidth - min) / 2;
//         var sy = (video1.videoHeight - min) / 2;
//         canvasOutputCtx.drawImage(video1, sx, sy, min, min, 0, 0, size, size);

//         // Define the square parameters
//         var squareSize = 200; // Adjust the size of the square as needed
//         var squareX = (size - squareSize) / 2;
//         var squareY = (size - squareSize) / 2;

//         // Save the current canvas state
//         canvasOutputCtx.save();

//         // Draw the red background
//         canvasOutputCtx.fillStyle = 'rgba(0,0,0,0.2)';
//         canvasOutputCtx.fillRect(0, 0, size, size);

//         // Set the global composite operation to 'destination-out' to clear the square area
//         canvasOutputCtx.globalCompositeOperation = 'destination-out';

//         // Draw the transparent square
//         canvasOutputCtx.fillStyle = 'rgba(0,0,0,0.2)';
//         canvasOutputCtx.fillRect(squareX, squareY, squareSize, squareSize);

//         // Restore the canvas state to remove the global composite operation
//         canvasOutputCtx.restore();
//         canvasOutputCtx.globalCompositeOperation = 'source-over';
//     }
// }



// function initializeface(){
//          //    for face bio 
//          navigator.mediaDevices
//          .getUserMedia({
//              video: {
//                  facingMode: "user",
//                  width: { min: 340, ideal: 640 },
//                  height: { min: 340, ideal: 640 },
//              },
//          })
//          .then(function (stream) {
//              video1.srcObject = stream;
//              video1.style.transform = "scale(-1,1)";
//              video1.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
//              video1.play();

//          });

//      //END

// }