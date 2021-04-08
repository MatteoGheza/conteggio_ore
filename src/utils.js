var dayjs = require('dayjs');
var customParseFormat = require( 'dayjs/plugin/customParseFormat');
require('dayjs/locale/it');

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
const notyf = new Notyf();

dayjs.extend(customParseFormat);
dayjs.locale('it');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
  
//https://stackoverflow.com/a/3146971
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
  
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

function download(bytes, extension="txt", contentType="text/plain"){
    let year = document.getElementById("year_selector").value;
    let month = dayjs().month(document.getElementById("month_selector").value-1).format("MMMM").capitalize();
    let filename = year + "_" + month;
    let blob=new Blob([bytes], {type: contentType});

    let link=document.createElement('a');
    link.href=window.URL.createObjectURL(blob);
    link.download=filename + "." + extension;
    link.click();
}

function exportHours(){
    let year = document.getElementById("year_selector").value;
    let month = document.getElementById("month_selector").value;
    let days = [];
    let days_table = Array.from(document.querySelectorAll("tr:not(.head)"));
    days_table.forEach((element) => {
        let cells = element.querySelectorAll("td");
        days.push({
            day_name: cells[0].innerText,
            day_number: parseInt(cells[1].innerText),
            hours: parseFloat(cells[2].querySelector("input").value) || 0,
            notes: cells[3].querySelector("input").value
        });
    })
    return {
        year: year,
        month: month,
        hours_total: parseFloat(document.querySelector("#total_hours").innerText) || 0,
        days: days
    };
}

export { dayjs, notyf, download, exportHours };