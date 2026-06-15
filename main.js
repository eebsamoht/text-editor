const isFileSystemAPISupported = 'showOpenFilePicker' in window;


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


const fileInput = document.querySelector("#fileInput");
fileInput.addEventListener('change', () => { onNewFileUploaded(fileInput.files); });


async function onNewFileUploaded(files) {
    const file = files[0];

    if (!file) {
        console.log("ERROR: no file uploaded!");
        return;
    }

    if (!file.type === 'text/plain') {
        console.log("ERROR: file type unsupported (please stick to text files!)");
    }

    const docNameLabel = document.querySelector("#docNameLabel");
    docNameLabel.textContent = file.name;
    page.value = await file.text();
}


const loadButton = document.querySelector("#loadButton");
loadButton.addEventListener('click', onLoadButtonClicked);


var openFileHandle;


async function onLoadButtonClicked() {
    if (isFileSystemAPISupported) {
        const options = {
            types: [
                { description: "Text file", accept: { "text/*": [".txt"] }}
            ]
        };
        [openFileHandle] = await window.showOpenFilePicker(options);
        const file = await openFileHandle.getFile();

        if (!file) {
            console.log("ERROR: no file uploaded!");
            return;
        }
    
        if (!file.type === 'text/plain') {
            console.log("ERROR: file type unsupported (please stick to text files!)");
        }

        const docNameLabel = document.querySelector("#docNameLabel");
        docNameLabel.textContent = file.name;
        page.value = await file.text();
    } else {  // use fallback system
        fileInput.click();
    }
}


const saveButton = document.querySelector("#saveButton");
saveButton.addEventListener('click', onSaveButtonClicked);


async function onSaveButtonClicked() {
    const finalBlob = new Blob([page.value], { type: 'text/plain' });

    // check if File System API is supported for in-place editing
    if (isFileSystemAPISupported) {
        if (!openFileHandle) {
            const options = {
                suggestedName: "new.txt",
                types: [
                    { description: "Text file", accept: { "text/*": [".txt"] }}
                ]
            };
            [openFileHandle] = await window.showSaveFilePicker(options);
        }

        const fileWriteStream = await openFileHandle.createWritable();
        await fileWriteStream.write(finalBlob);
        await fileWriteStream.close();
    } else {  // fallback to a good old download link.
        const link = document.createElement('a');
        link.download = document.querySelector("#docNameLabel").textContent;
        link.href = URL.createObjectURL(finalBlob);

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
}


const newButton = document.querySelector("#newButton");
newButton.addEventListener('click', onNewButtonClicked);


async function onNewButtonClicked() {
    if (page.value.length > 0) {
        onSaveButtonClicked();
    }

    openFileHandle = null;
    const docNameLabel = document.querySelector("#docNameLabel");
    docNameLabel.textContent = "new.txt";
    page.value = "";
}
