const inputCanvas = document.querySelector('.input canvas');
const outputCanvas = document.querySelector('.output canvas');
const inputContext = inputCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

let width = 0;
let height = 0;

const uploadArea = document.querySelector('.upload');
const inputUrl = uploadArea.querySelector('input[name=url]');
const inputButton = uploadArea.querySelector('button');
let uploadErrors = 0;
const uploadErrorMessage = uploadArea.querySelector('span[name=uploadError');

const messageInput = document.querySelector('#message');
const spacingInput = document.querySelector('input[name=spacing]');
const colourInput = document.querySelector('select[name=colour]');
const encodeButton = document.querySelector('button[name=encode]');

function inputImage(e) {
    console.log(e);
    const image = new Image;
    image.crossOrigin = 'anonymous';
    image.src = inputUrl.value;
    image.addEventListener('load', (e) => {
        width = image.width;
        height = image.height;
        inputCanvas.width = width;
        inputCanvas.height = height;
        outputCanvas.width = width;
        outputCanvas.height = height;
        inputContext.drawImage(image, 0, 0, width, height);

        inputButton.classList.remove('button-primary');
        encodeButton.classList.add('button-primary');

        uploadErrors = 0;
        uploadErrorMessage.innerHTML = '';
    });

    image.addEventListener('error', (e) => {
        if (uploadErrors > 0)
            uploadErrorMessage.innerHTML = `Error retrieving image. Please try another url. x${uploadErrors+1}`;
        else
            uploadErrorMessage.innerHTML = 'Error retrieving image. Please try another url.';

        ++uploadErrors;
    });
}

function encodeImage(e) {
    const spacing = parseInt(spacingInput.value);
    const colour = colourInput.value;
    const message = messageInput.value;

    let pixels = inputContext.getImageData(0, 0, width, height);
    outputContext.putImageData(pixels, 0, 0);
}

inputButton.addEventListener('click', inputImage);
