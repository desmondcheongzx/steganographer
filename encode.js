const inputCanvas = document.querySelector('.input canvas');
const outputCanvas = document.querySelector('.output canvas');
const inputContext = inputCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

let width = 0;
let height = 0;

const uploadArea = document.querySelector('.upload');
const urlInput = uploadArea.querySelector('input[name=url]');
const urlButton = uploadArea.querySelector('button[name=getUrl]');
let uploadErrors = 0;
const uploadErrorMessage = uploadArea.querySelector('span[name=uploadError');

const fileInput = uploadArea.querySelector('input[name=imageFile]');
const fileButton = uploadArea.querySelector('button[name=getFile]');

const messageInput = document.querySelector('#message');
const spacingInput = document.querySelector('input[name=spacing]');
const colourInput = document.querySelector('select[name=colour]');
const encodeButton = document.querySelector('button[name=encode]');
let encodeErrors = 0;
const encodeErrorMessage = document.querySelector('span[name=encodeError]');

function inputImage(imageSrc) {
    const image = new Image;
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.addEventListener('load', (e) => {
        width = image.width;
        height = image.height;
        inputCanvas.width = width;
        inputCanvas.height = height;
        outputCanvas.width = width;
        outputCanvas.height = height;
        inputContext.drawImage(image, 0, 0, width, height);

        urlButton.classList.remove('button-primary');
        fileButton.classList.remove('button-primary');
        encodeButton.classList.add('button-primary');

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

function uploadImageError() {
    if (uploadErrors > 0)
        uploadErrorMessage.innerHTML = `Error retrieving image. Please try another url or file. x${uploadErrors+1}`;
    else
        uploadErrorMessage.innerHTML = 'Error retrieving image. Please try another url or file.';

    ++uploadErrors;
    
}

function encodeImage(e) {
    const spacing = parseInt(spacingInput.value);
    const colour = colourInput.value;
    const message = messageInput.value;
    let colourVal = 0;
    if (colour == 'G')
        colourVal = 1;
    else if (colour == 'B')
        colourVal = 2;
        

    let pixels = inputContext.getImageData(0, 0, width, height);
    let messagePos = 0;

    for (let i = 0; i < pixels.data.length; i += 4 * spacing) {
        if (messagePos >= message.length) {
            pixels.data[i + colourVal] = 0;
            break;
        }

        pixels.data[i + colourVal] = message.charCodeAt(messagePos);

        ++messagePos;
    }

    if (messagePos < message.length) {
        if (encodeErrors > 0)
            encodeErrorMessage.innerHTML = `Error encoding. Message length exceeds size of image. Try decreasing the spacing or breaking the message into smaller parts. x${encodeErrors+1}`;
        else
            encodeErrorMessage.innerHTML = `Error encoding. Message length exceeds size of image. Try decreasing the spacing or breaking the message into smaller parts.`;

        ++encodeErrors;
    } else {
        encodeErrorMessage.innerHTML = '';
        encodeErrors = 0;
    }    
    
    outputContext.putImageData(pixels, 0, 0);
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
