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

const links = document.querySelector('.links');
const outputUrl = links.querySelector('textarea[name=outputUrl]');
const downloadLink = links.querySelector('a[name=download]');
const copyButton = links.querySelector('button[name=copy]');
const downloadButton = links.querySelector('button[name=download]');

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

function encodeImageError() {
    generateErrorMessage(encodeErrorMessage, encodeErrors++, 'Error encoding. Message length exceeds size of image. Try decreasing the spacing or breaking the message into smaller parts.');
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
        encodeImageError();
        return;
    }
    
    encodeErrorMessage.innerHTML = '';
    encodeErrors = 0;
    outputContext.putImageData(pixels, 0, 0);
    generateDownloadLinks();
}

function generateDownloadLinks() {
    const url = outputCanvas.toDataURL('image/png');
    downloadLink.href = url;
    outputUrl.textContent = url;
    copyButton.disabled = false;
    copyButton.classList.add('button-primary');
    downloadButton.classList.add('button-primary');
}

function copyLink() {
    outputUrl.select();
    document.execCommand('copy');
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

copyButton.addEventListener('click', copyLink);
copyButton.disabled = true;
