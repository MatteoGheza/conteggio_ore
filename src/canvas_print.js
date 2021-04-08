import 'html2canvas';
import 'printjs';

//TODO: add PoC and an option in main.js for printing with canvas:
//      overwrite window.print with a custom function, lazy load using
//      Webpack require and promises this file
function printWithCanvas(){
    document.querySelector(".button_container").classList.add("hide");
    html2canvas(document.querySelector("body")).then(canvas => {
        printJS({printable: canvas.toDataURL(), type: 'image'});
        document.querySelector(".button_container").classList.remove("hide");
    });
}

window.printWithCanvas = printWithCanvas;