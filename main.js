const fileInput = document.querySelector("#fileInput");
fileInput.addEventListener('change', () => { onNewFileUploaded(fileInput.files); });

const page = document.querySelector("#page");
page.addEventListener('dragenter', onPageDragEnter);
page.addEventListener('dragover', onPageDragOver);
page.addEventListener('drop', onPageDrop);
page.addEventListener('keydown', onPageKeydown);


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


function onPageKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const selectionStart = page.selectionStart;
        const selectionEnd = page.selectionEnd;

        const textUpToSelection = page.value.substring(0, selectionEnd);
        const lines = textUpToSelection.split("\n");
        const currentLine = lines[lines.length - 1];

        var newline = "\n";
        
        if (currentLine[0] === " ") {
            if (/^[0-9]$/.test(currentLine[1])) {
                for (var i = 2; i < currentLine.length - 1; i++) {
                    if (currentLine[i] === "." && currentLine[i + 1] === " ") {
                        var listElementNumber = parseInt(currentLine.split(" ")[1]);
                        if (listElementNumber !== NaN) {
                            listElementNumber += 1;
                            newline += " " + listElementNumber + ". ";
                        }
                        break;
                    }
                }
            } else if (currentLine.substring(1, 3) === "- ") {
                newline += " - ";
            }
        }

        page.setRangeText(
            newline,
            selectionStart,
            selectionEnd,
            'end'
        );
    }
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