//for face camera

var video1 = document.getElementById("vid");
var canvasOutput = document.getElementById("canvasOutput");
var canvasOutputCtx = canvasOutput.getContext("2d");
var size = 350;
let maskImg;
var srcMat;
var grayMat;
let faceClassifier = null;
let detectFace = document.getElementById('face');
var radiusX = 95; // Adjust the radius along X-axis as needed
var radiusY = 120; // Adjust the radius along Y-axis as needed
var centerX = size / 2;
var centerY = size / 2;



const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}





async function runcamera() {
  canvasOutput.width = size;
  canvasOutput.style.transform = "scale(-1,1)";
  cameraInputs.height = size;
  await initializeface();
  var canvasInput = document.createElement('canvas');
  canvasInput.width = videoWidth;
  canvasInput.height = videoHeight;
  var canvasInputCtx = canvasOutput.getContext('2d');

  // Draw the rectangle
  canvasInputCtx.fillStyle = 'rgba(255,255,255,0.4)';
  canvasInputCtx.fillRect(0, 0, size, size);

  // Draw the oval

  // Define the oval parameters

  // var radiusX = 95; // Adjust the radius along X-axis as needed
  // var radiusY = 120; // Adjust the radius along Y-axis as needed

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

  srcMat = new cv.Mat(size, size, cv.CV_8UC4);
  grayMat = new cv.Mat(size, size, cv.CV_8UC1);

  faceClassifier = new cv.CascadeClassifier();
  faceClassifier.load('haarcascade_frontalface_default.xml');

  setInterval(() => {
    draw(canvasOutputCtx, canvasInputCtx);
  }, 100);
}

var scanning = true;
var faceb64 = "";

function draw(canvasOutputCtx, canvasInputCtx) {
  if (video1 != null && scanning) {
    // Save the current canvas state
    canvasInputCtx.save();
    var min = Math.min(video1.videoHeight, video1.videoWidth);
    var sx = (video1.videoWidth - min) / 2
    var sy = (video1.videoHeight - min) / 2
    canvasOutputCtx.drawImage(video1, 0, 0, canvasOutput.width, canvasOutput.height);
    // TODO face detection image
    let facedetectimageData = canvasOutputCtx.getImageData(0, 0, canvasOutput.width, canvasOutput.height)
    console.log("height: " + facedetectimageData.height + " width: " + facedetectimageData.width)

    // TODO face detection processing
    srcMat.data.set(facedetectimageData.data);
    cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
    let faces = [];
    if (detectFace.checked) {
      let faceVect = new cv.RectVector();
      let faceMat = new cv.Mat();

      cv.pyrDown(grayMat, faceMat);
      cv.pyrDown(faceMat, faceMat);

      faceClassifier.detectMultiScale(faceMat, faceVect);
      // TODO get the largest face
      var largestFaceSize = -1;
      var largestFace = undefined;
      for (let i = 0; i < faceVect.size(); i++) {
        let face = faceVect.get(i);
        faces.push(new cv.Rect(face.x, face.y, face.width, face.height));
        let faceSize = (face.height > face.width) ? face.height : face.width
        if (faceSize > largestFaceSize) {
          largestFaceSize = faceSize;
          largestFace = face;
        }
      }
      if (faces.length > 0) {
        console.log("FACE FOUND!!!!!!!!!");
      }
      if (largestFaceSize >= 60) {  
        // TODO check the neural network input size
        // TODO hide message
        scanning = false;
        document.getElementById("get-closer").style.display = "none";
        var panel = 'third-panel';
        // let face = faceVect.get(largestFace);
        let faceImageData = canvasOutputCtx.getImageData(largestFace.x * 4, largestFace.y * 4, largestFace.width * 4, largestFace.height * 4);

        let faceCanvas = document.createElement("canvas");
        // faceCanvas.width = faceImg.width;
        // faceCanvas.height = faceImg.height;
        faceCanvas.width = largestFace.width* 4;
        faceCanvas.height = largestFace.height* 4;

        let faceCanvasContext = faceCanvas.getContext("2d");
        faceCanvasContext.putImageData(faceImageData, 0, 0);

        faceb64 = faceCanvas.toDataURL("image/jpeg");
        // var image =faceCanvas.toDataURL("image/jpeg", 1.0).replace("image/jpeg", "image/octet-stream");
        // var link = document.createElement('a');
        // link.download = generateString(5)+".jpeg";
        // link.href = image;
        // link.click();
        console.log(faceb64)
        faceb64 = faceb64.replace("data:image/jpeg;base64,", "")

        
        for (let i = 0; i < spannum.length; i++) {
          spannum[2].innerText = '3'

          spannum[i].classList.add('done')
          spannum[i].innerText = '✔'
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
          stepcontainer[i].classList.add('act')
        }
        centbody.style.display = "flex";
        setTimeout(() => {
          centbody.style.display = "none";
          const data = {"face":faceb64, "qr":qrb64};
          stopCamera()
          postJSON(data);
        }, 2000);
        // setInterval(() => {
        //   successbody.style.opacity = '1';
        //   successimg.style.display = 'flex';
        // }, 2000);

      } else {
        // TODO display message
        document.getElementById("get-closer").style.display = "block";
      }
    }

    canvasOutputCtx.drawImage(maskImg, 0, 0);

  }
  else {

  }
}


async function postJSON(data) {

      const response = await fetch("https://efe2-112-199-114-2.ngrok-free.app/api/login/", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response);
  
        if (response["status"] != "ok") {
            console.log("Issue:" , response["err_msg"]);
            alert("ERROR: "+response["err_msg"])
            return;
        }
        else{
        // Login was ok
        // setInterval(() => {
          // centbody.style.display="none";
        // }, 2000);
        // setInterval(() => {
          successbody.style.opacity='1';
          successimg.style.display='flex';
        // }, 2000); 

        }
  
       
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


async function initializeface() {
  cameraPhoto = new JslibHtml5CameraPhoto.default(video1);
  var facingMode = "USER";
  var idealResolution = { width: 320, height: 320 };
  cameraPhoto.startCamera(FACING_MODES[facingMode], idealResolution)
    .then(() => {
      var log =
        `Camera started with default resolution and ` +
        `prefered facingMode : ${facingMode}`;
      console.log(log);
      //      video1.style.transform = "scale(-1,1)";
      video1.setAttribute("playsinline", true);
      video1.play();
    }, (err) => { console.log("face inline error in start camera", err) })
    .catch((error) => {
      console.error('Camera not started!', error);
    });
  //END
}

