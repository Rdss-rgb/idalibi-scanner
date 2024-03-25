//for face camera

var video1 = document.getElementById("vid");
var canvasOutput = document.getElementById("canvasOutput");
var canvasOutputCtx = canvasOutput.getContext("2d");
var size=350;
let maskImg;
var srcMat;
var grayMat;
let faceClassifier = null;
let detectFace = document.getElementById('face');
var radiusX = 95; // Adjust the radius along X-axis as needed
var radiusY = 120; // Adjust the radius along Y-axis as needed
var centerX = size / 2;
var centerY = size / 2;



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
        draw(canvasOutputCtx,canvasInputCtx);
    }, 100);

    // face detection
    // srcMat = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
    // grayMat = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);

}





function draw(canvasOutputCtx,canvasInputCtx) {
   
    if(video1!=null){
        // Save the current canvas state
        canvasInputCtx.save();
        var min = Math.min(video1.videoHeight, video1.videoWidth);
        var sx  =(video1.videoWidth-min)/2
        var sy  =(video1.videoHeight-min)/2
        // canvasOutputCtx.drawImage(video1,sx,sy,min,min, 0, 0, size,size);
        canvasOutputCtx.drawImage(video1,0,0,canvasOutput.width,canvasOutput.height);

        // TODO face detection image
        let facedetectimageData = canvasOutputCtx.getImageData(0, 0, canvasOutput.width, canvasOutput.height)

        console.log("height: " + facedetectimageData.height + " width: " + facedetectimageData.width)

        

        // TODO face detection processing

        srcMat.data.set(facedetectimageData.data);
   
        cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
        // console.log(cv)
        let faces = [];
        if (detectFace.checked) {
            let faceVect = new cv.RectVector();
            let faceMat = new cv.Mat();

            cv.pyrDown(grayMat, faceMat);
            cv.pyrDown(faceMat, faceMat);
            // size = faceMat.size();

            faceClassifier.detectMultiScale(faceMat, faceVect);
             // TODO get the largest face
            var largestFaceSize = -1;
            var largestFace = -1;
            for (let i = 0; i < faceVect.size(); i++) {
                let face = faceVect.get(i);
                faces.push(new cv.Rect(face.x, face.y, face.width, face.height));
              
                let faceSize = (face.height > face.width) ? face.height : face.width
                if (faceSize > largestFaceSize) {
                    largestFaceSize = faceSize;
                  
                }
            }
            if (faces.length > 0) {
                console.log("FACE FOUND!!!!!!!!!");
            }
            // console.log('FACES',faces)
            // document.getElementById("get-closer").innerText = largestFaceSize;
            if (largestFaceSize >= 60) {  // TODO check the neural network input size
               // TODO hide message
               var image =canvasOutput.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
               var link = document.createElement('a');
               link.download = "face.png";
               link.href = image;
               link.click();
               document.getElementById("get-closer").style.display = "none";
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
               stopCamera()
            } else {
                // TODO display message
                document.getElementById("get-closer").style.display = "block";
            }

        //     faceMat.delete();
        //     faceVect.delete();

        //     // TODO LATER: FLASH

        //     // get the face
        //     let faceImageData = canvasOutputCtx.getImageData(0, 0, size,size);
        //     // put this image into an in-memory canvas
        //     var canvasimage = document.createElement('canvas');
        //     canvasimage.append(faceImageData);


        //     // use toDataURL to get the face from the in-memory canvas
        //      let imgdata = canvasimage.toDataURL();
 
        //     // log it
        //     // console.log('Image:', imgdata);

        //    // TODO move to the last page (verify page)

            // var panel='third-panel';
            //     for (let i = 0; i < spannum.length; i++) {
            //         spannum[2].innerText='3'
              
            //             spannum[i].classList.add('done')
            //             spannum[i].innerText='✔'
                    
            //     }
            //     slidecontainer.forEach(element => {
            //         if(panel==element.id){
            //             element.classList.remove('hide-slider');
            //         }
            //         else{
            //             element.classList.add('hide-slider');
            //         }
            //     });
            //     for (let i = 0; i < stepcontainer.length; i++) {
            //         stepcontainer[i].classList.add('act')   
            // }
            //     centbody.style.display="flex";
            //     setInterval(() => {
            //         centbody.style.display="none";
            //     }, 2000);    
            //     setInterval(() => {
            //         successbody.style.opacity='1';
            //         successimg.style.display='flex';
            //     }, 2000); 
            

        }

        canvasOutputCtx.drawImage(maskImg,0,0);

    }
    else {

    }
}



async function initializeface(){
    //    for face bio 
    // await navigator.mediaDevices
    //  .getUserMedia({
    //      video: {
    //         //  facingMode: "user",
    //          width: { min: 340, ideal: 640 },
    //          height: { min: 340, ideal: 640 },
    //      },
    //  })
    //  .then(function (stream) {
    //      video1.srcObject = stream;
    //      video1.style.transform = "scale(-1,1)";
    //      video1.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //      video1.play();

    //  }, (err) => {console.log("inline error for face camera", err)})
    //   .catch((err) => {
    //     console.log("unable to start face camera", err);
    //  });
    //  preventSleep(true);

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
        }, (err) => {console.log("face inline error in start camera", err)})
        .catch((error) => {
            console.error('Camera not started!', error);
        });

     //END

}


