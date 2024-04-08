//qr scanner
var camera = document.querySelector('#cameraswitch');
let cameraInputsMap = {};
let cameraInputs = [];
var selectedCameraIndex = -1;
var defaultCamera = "environment"; //"environment" or "user";

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

window.addEventListener('load', function () {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      console.log(devices)
      devices.forEach((v, k) => {
        if (v.kind != "videoinput") {
          return;
        }
        // alert("kind " + v.kind)
        // alert(`facingMode: ${v.getCapabilities().facingMode}`)
        let aspectRatio = function() {
          var buf = [];
          for (i in v.getCapabilities().aspectRatio) {
            buf.push(`${i}: ${v.getCapabilities().aspectRatio[i]}`);
          }
          return buf.join("\n");
        }()
        // alert(`aspectRatio: ${aspectRatio}`)
        
        console.log("V: ", v.getCapabilities().facingMode)
        if (cameraInputsMap[v.getCapabilities().facingMode] == undefined) {
          cameraInputsMap[v.getCapabilities().facingMode] = v;
        } else {
          if (cameraInputsMap[v.getCapabilities().facingMode].getCapabilities().aspectRatio.max < v.getCapabilities().aspectRatio.max) {
            cameraInputsMap[v.getCapabilities().facingMode] = v;
          }
        }
        console.log("Cameras: ", cameraInputs)
        // cameraInputs.push(v);
      });

      for (i in cameraInputsMap) {
        cameraInputs.push(cameraInputsMap[i]);
        if (cameraInputsMap[i].getCapabilities().facingMode.findIndex((element) => element == defaultCamera) != -1) {
          selectedCameraIndex = cameraInputs.length - 1;
          localStorage.setItem("deviceID", cameraInputs[selectedCameraIndex]);
        }
      }
      console.log(cameraInputs);
      if (cameraInputs.length <= 1) {
        alert("No camera detected");
        camera.style.display = 'none';
        canvasqr.style.transform = "scale(-1,1)";
      }
    })

  // If there is a camera but it doesn't match the requirment, select it
  if (cameraInputs.length > 0 && selectedCameraIndex == -1) {
    selectedCameraIndex = 0;
    sourceSelect.value = cameraInputs[selectedCameraIndex];
    localStorage.setItem("deviceID", cameraInputs[selectedCameraIndex]);
  }
})

var qrb64 = "";

async function decodeQR(vid) {
  const codeReader = new ZXing.BrowserQRCodeReader()
  try {
    const result = await codeReader.decodeFromVideo(vid)
    console.log(result.text)

    //  * Start of the byte decoding from the QR code result
    // Initial storage for the raw bytes
    var raw = "";
    // Define the length and format of the data (Initial)
    var length = 0;
    var format = 0;

    qrb64 = btoa(String.fromCharCode.apply(null, result.rawBytes));

    console.log(qrb64);

    // for (var i in result.rawBytes){
    //   // Parse the value to int since the data result is still text
    //   i = parseInt(i);
    //   // Check for empty strings in the result and disregard
    //   if (i == result.rawBytes.length - 1){
    //     break;
    //   }

    //   // Initialize 2 variables as the temporary data holder while looping in the results
    //   var val0 = toHex(result.rawBytes[i])
    //   var val1 = toHex(result.rawBytes[i + 1])

    //   // Get the QR Code Format (Refer to the QR code documentation regarding this)
    //   if (i == 0){
    //     format = val0[0];
    //     length = "0x" + val0[1];
    //     continue;
    //   }else if(i == 1){
    //     length += [val0[0]];
    //     length = parseInt(length);
    //   }
    //   var tempByte = "0x" + val0[1] + val1[0];
    //   // Compare the length of the original result vs the bytes processed
    //   if(i != result.text.length -1){
    //     tempByte += ", ";
    //   }
    //   var c = parseInt(i);
    //   if (c % 10 == 0 && i != 0){
    //     tempByte += "\n";
    //   }
    //   raw += tempByte

    //   console.log("raw string: ", raw.toString());
    //   console.log("formatted: ", raw.split("0x").join(""));
    //   console.log("raw: ", raw.split("0x").join(""))
    //   // Process the data accordingly after the bit shifts
    // }


    // * End of the byte decoding from the QR code result
    document.querySelector('.qr-body').style.opacity = '0';
    setTimeout(() => {
      document.querySelector('.result-container').style.display = 'flex';
      document.querySelector('.result-container').style.opacity = '0';
      document.querySelector('.result-container').style.trasition = '500ms ease-out';
      setTimeout(() => {
        document.querySelector('.result-container').style.opacity = '1';
      }, 200);

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
      stopCamera();
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
    canvasqr.style.transform = "scale(-1,1)";
    x = false;
    document.querySelector('#switch').style.display = 'flex';
    setTimeout(() => {
      switchcamera()
    }, 500);
  }
  else {
    canvasqr.style.transform = "unset";
    x = true;
    document.querySelector('#switch').style.display = 'flex';
    setTimeout(() => {
      switchcamera()
    }, 500);
  }


})
function switchcamera() {
  selectedCameraIndex = (selectedCameraIndex+1)%cameraInputs.length; // Toggle between 0 and 1
  // alert("cameraInputs.label: " + cameraInputs[selectedCameraIndex].label);
  // let aspectRatio = function() {
  //   var buf = [];
  //   for (i in cameraInputs[selectedCameraIndex].getCapabilities().aspectRatio) {
  //     buf.push(`${i}: ${cameraInputs[selectedCameraIndex].getCapabilities().aspectRatio[i]}`);
  //   }
  //   return buf.join("\n");
  // }()
  // alert("aspectRatio: " + aspectRatio);
  startCameraDefaultResolution()
  setTimeout(() => {
    document.querySelector('#switch').style.display = 'none';
  }, 800);


  // var selectElement = document.getElementById("facingModeSelectId");
  // var selectedIndex = selectElement.selectedIndex;
  // var nextIndex = selectedIndex === 0 ? 1 : 0; // Toggle between 0 and 1
  // selectElement.selectedIndex = nextIndex;
  // startCameraDefaultResolution()
  // setTimeout(() => {
  //   document.querySelector('#switch').style.display = 'none';
  // }, 800);
}


// Function that converts the data type for hex values
function toHex(v){
  var val = String(v.toString(16));
  // Create the format of 0x something for the hex standard value format
  if (val.length == 1){
    val = "0"+val;
  }
  return val;
}