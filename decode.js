const inputCanvas = document.querySelector('.input canvas');
const inputContext = inputCanvas.getContext('2d');

let width = 0;
let height = 0;

const uploadArea = document.querySelector('.upload');
const urlInput = uploadArea.querySelector('input[name=url]');
const urlButton = uploadArea.querySelector('button[name=getUrl]');
let uploadErrors = 0;
const uploadErrorMessage = uploadArea.querySelector('span[name=uploadError');

const fileInput = uploadArea.querySelector('input[name=imageFile]');
const fileButton = uploadArea.querySelector('button[name=getFile]');

const spacingInput = document.querySelector('input[name=spacing]');
const colourInput = document.querySelector('select[name=colour]');
const decodeButton = document.querySelector('button[name=decode]');

const decodedOutput = document.querySelector('.output textarea');

function inputImage(imageSrc) {
    const image = new Image;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    if(imageSrc.startsWith("data:")) {
        image.src = imageSrc;
    } else {
        image.crossOrigin = 'anonymous';
        image.src = proxyUrl+imageSrc;
    }
    image.addEventListener('load', (e) => {
        width = image.width;
        height = image.height;
        inputCanvas.width = width;
        inputCanvas.height = height;
        inputContext.drawImage(image, 0, 0, width, height);

        urlButton.classList.remove('button-primary');
        fileButton.classList.remove('button-primary');
        decodeButton.classList.add('button-primary');

        uploadErrors = 0;
        uploadErrorMessage.innerHTML = '';
    });

    image.addEventListener('error', uploadImageError);
}

function uploadUrl(e) {
    inputImage(urlInput.value);
}

function uploadFile(e) {
    const file = fileInput.files[0];
    if (!file.type.match('image.*'))
        return;
    const reader = new FileReader();

    reader.addEventListener('load', (e) => inputImage(e.target.result));

    reader.addEventListener('error', uploadImageError);

    reader.readAsDataURL(file);
}

function generateErrorMessage(location, number, message) {
    if (number > 0)
        location.innerHTML = `${message} x${number+1}`;
    else
        location.innerHTML = message;
    ++number;
}

function uploadImageError() {
    generateErrorMessage(uploadErrorMessage, uploadErrors++, 'Error retrieving image. Please try another url or file.'); 
}

function decodeImage(e) {
    const spacing = parseInt(spacingInput.value);
    const colour = colourInput.value;
    let colourVal = 0;
    if (colour == 'G')
        colourVal = 1;
    else if (colour == 'B')
        colourVal = 2;

    let message = '';
    let pixels = inputContext.getImageData(0, 0, width, height);

    for (let i = 0; i < pixels.data.length; i += 4 * spacing) {
        const val = pixels.data[i + colourVal];
        if (val == 0)
            break;
        message += String.fromCharCode(val);
    }

    decodedOutput.textContent = message;
}

function checkUploadFunctionality() {
    if (!window.File || ! window.FileReader || !window.FileList || !window.Blob) {
        fileInput.disabled = true;
        fileButton.disabled = true;
    }
}

urlInput.addEventListener('change', (e) => urlButton.classList.add('button-primary'));
urlButton.addEventListener('click', uploadUrl);

fileButton.addEventListener('click', uploadFile);
fileButton.disabled = true;
fileInput.addEventListener('change', (e) => {
    const file = fileInput.files[0];
    if (file.type.match('image.*')) {
        fileButton.disabled = false;
        fileButton.classList.add('button-primary');
    } else {
        fileButton.disabled = true;
        fileButton.classList.remove('button-primary');
    }
});

checkUploadFunctionality();
