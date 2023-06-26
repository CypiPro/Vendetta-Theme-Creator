function goto(id) {
    document.getElementById(id).scrollIntoView();
}

let loadedTheme;
let variant = 0;
const ThemeLoad = new CustomEvent('ThemeLoad');

function updateVariant(radio) {
    variant = radio.value;

    loadTheme(loadedTheme, variant);
}

function loadFromFile(path, variantID) {
    fetch(path)
        .then(response => response.json())
        .then(data => {
            loadedTheme = data;
            loadTheme(loadedTheme, variantID);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function loadTheme(Theme, variantID) {
    loadedTheme = Theme;

    // theme data
    // tba

    // semantic colors
    const semanticColors = Theme.semanticColors;
    variant = variantID;

    for (const [key, value] of Object.entries(semanticColors)) {
        try {
            document.getElementsByClassName(key)[0].value = value[variantID];
            document.getElementsByClassName(key)[1].value = value[variantID];

            document.documentElement.style.setProperty(`--${key}`, value[variantID]);

            window.addEventListener("load" , syncColor(key));
        }
        catch (error) {
            console.error(error);
        }
    }
    dispatchEvent(ThemeLoad);
}


function syncColor(className) {
    const element1 = document.getElementsByClassName(className)[0];
    const element2 = document.getElementsByClassName(className)[1];

    // const preview = document.getElementsByClassName('preview '+className);

    element1.addEventListener('input', () => {
        element2.value = element1.value;

        loadedTheme.semanticColors[className][variant] = element1.value;
        
        document.documentElement.style.setProperty(`--${className}`, element1.value);
    });

    element2.addEventListener('input', () => {
        element1.value = element2.value;

        loadedTheme.semanticColors[className][variant] = element2.value;

        document.documentElement.style.setProperty(`--${className}`, element2.value);
    });

    window.addEventListener('ThemeLoad', () => {
        element1.value = element2.value;
        document.documentElement.style.setProperty(`--${className}`, element2.value);
        // for (let i = 0; i < preview.length; i++) {preview[i].style[param] = element2.value;}
    });
}


function previewInit() {
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    const left = document.getElementById('left');
    const right = document.getElementById('right');
    const middle = document.getElementById('middle');


    leftButton.addEventListener('click', () => {
        if (left.style.display == 'none') {
            left.style.display = 'block';
            setTimeout(() => {
                middle.style.transform = 'translateX(133px) translateY(-50%)';
                middle.style.clipPath = "polygon(0 0, 15% 0, 15% 100%, 0 100%)";
            }, 300);
        }

        else {
            middle.style.transform = 'translateX(-50%) translateY(-50%)';
            middle.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
            setTimeout(() => {
                left.style.display = 'none';
            }, 300);
        }
    });

    rightButton.addEventListener('click', () => {
        if (right.style.display == 'none') {
            right.style.display = 'block';
            setTimeout(() => {
                middle.style.transform = 'translateX(-513px) translateY(-50%)';
                middle.style.clipPath = "polygon(85% 0, 100% 0, 100% 100%, 85% 100%)";
            }, 300);
        }

        else {
            middle.style.transform = 'translateX(-50%) translateY(-50%)';
            middle.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
            setTimeout(() => {
                right.style.display = 'none';
            }, 300);
        }
    });

    rightButton.click();
    leftButton.click();
}



function exportSettings() {
    loadedTheme.name = document.getElementById('themeName').value;
    loadedTheme.description = document.getElementById('themeDescription').value;
    loadedTheme.authors.push({"name":`${document.getElementById('themeAuthorName').value}`, "id":`${document.getElementById('themeAuthorID').value}}`})
    const file = JSON.stringify(loadedTheme)

    const blob = new Blob([file], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, "_blank");
}




function dropHandler(ev) {
    const dropZone = document.getElementById('sidebar');
    dropZone.style.backgroundColor = '';
    dropZone.style.border = '';

    console.log("File dropped");
    let json;

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    const file = ev.dataTransfer.files[0];

    // Read the contents of the file
    const reader = new FileReader();
    reader.onload = () => {
        // Parse the contents of the file as JSON
        json = JSON.parse(reader.result);
        loadTheme(json, variant)
    };
    reader.readAsText(file);
}

function dragOverHandler(ev) {
    const dropZone = document.getElementById('sidebar');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // Change the sidebar color
    dropZone.style.backgroundColor = '#e0e0ee';
    dropZone.style.borderLeft = '3px dashed #aaaabb';
}

function dragLeaveHandler(ev) {
    const dropZone = document.getElementById('sidebar');

    // Change the sidebar color back to its original color
    dropZone.style.backgroundColor = '';
    dropZone.style.border = '';
}



// window.addEventListener("beforeunload", function (e) {
//     e.preventDefault();
//     const confirmationMessage = 'Are you sure you want to leave?';

//     (e || window.e).returnValue = confirmationMessage;
//     return confirmationMessage;

// });


function openPopup() {
    document.getElementById("popup").style.display = "flex";
  }

  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }