const fileInput = document.querySelector("#fileInput");
fileInput.addEventListener('changed', onNewFileUploaded);

const page = document.querySelector("#page");
page.addEventListener('dragenter', onPageDragEnter);
page.addEventListener('dragover', onPageDragOver);
page.addEventListener('drop', onPageDrop);


function onPageDragEnter() {
    e.stopPropagation();
    e.preventDefault();
}


function onPageDragOver() {
    e.stopPropagation();
    e.preventDefault();
}


function onPageDrop() {
    e.stopPropagation();
    e.preventDefault();
}


function onNewFileUploaded(files) {
    const file = this.files[0];

}