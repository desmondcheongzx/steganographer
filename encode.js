const inputCanvas = document.querySelector('.input canvas');
const outputCanvas = document.querySelector('.output canvas');
const inputContext = inputCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

const uploadArea = document.querySelector('.upload');
const inputUrl = uploadArea.querySelector('input[name=url]');
const inputButton = uploadArea.querySelector('button');
let uploadErrors = 0;
const uploadErrorMessage = uploadArea.querySelector('span[name=uploadError');

const encodeButton = document.querySelector('button[name=encode]');

const spacingInput = document.querySelector('input[name=spacing]');
const colourInput = document.querySelector('select[name=colour]');

function inputImage(e) {
    console.log(e);
    const image = new Image;
    image.src = inputUrl.value;
    image.addEventListener('load', (e) => {
        const width = image.width;
        const height = image.height;
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
}

inputButton.addEventListener('click', inputImage);
