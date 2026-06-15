const fileInput = document.querySelector("#fileInput");
fileInput.addEventListener('change', () => { onNewFileUploaded(fileInput.files); });

const page = document.querySelector("#page");
page.addEventListener('dragenter', onPageDragEnter);
page.addEventListener('dragover', onPageDragOver);
page.addEventListener('drop', onPageDrop);


function onPageDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
}


function onPageDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
}


function onPageDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log(event.dataTransfer.files[0]);

    onNewFileUploaded(event.dataTransfer.files);
}


function onNewFileUploaded(files) {
    const file = files[0];

    if (!file) {
        console.log("ERROR: no file uploaded!");
        return;
    }

    if (!file.type.startsWith("text")) {
        console.log("ERROR: file type unsupported (please stick to text files!)");
    }

    const docNameLabel = document.querySelector("#docNameLabel");
    docNameLabel.textContent = file.name;

    const fReader = new FileReader();
    fReader.onload = () => {
        page.value = fReader.result;
    }
    fReader.readAsText(file);
}