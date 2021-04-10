import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { dayjs, notyf, download, exportHours } from './utils.js';

const USE_TWO_TABLES = false;

console.log("Bundle env: "+process.env.BUNDLE_ENV);
console.log("Bundle date: "+new Date(process.env.BUNDLE_DATE).toISOString());
console.log("Reload enabled: "+(process.env.RELOAD === true ? "yes" : "no"));

var tot = 0;
var storage_name = "hours_default";

if(USE_TWO_TABLES){
    document.querySelector("#pageBody > div.container > div").insertAdjacentHTML('beforeend', '<div class="col"><table class="table table-bordered table-striped"><thead><tr class="head"><td style="width: 15%;">Giorno</td><td>Data</td><td>Ore</td><td style="width: 60%;">Note</td></tr></thead><tbody></tbody></table></div>');
}

function generateMonthSelector(){
    let selector = document.getElementById("month_selector");
    for (let i = 0; i < 12; i++) {
        var option = document.createElement("option");
        option.text = dayjs().month(i).format("MMMM").capitalize();
        option.value = i+1;
        selector.add(option);
    }
    selector.value = dayjs().month()+1;
    selector.addEventListener('change', function (evt) {
        monthSelected();
    });
}

function yearSelected(){
    checkStorageAndGenerateTable();
}
function monthSelected(){
    checkStorageAndGenerateTable();
}

var tot = 0;
function updateHoursTotal(){
    tot = 0;
    document.getElementsByName("hours_input").forEach((element) => {
        tot += parseFloat(element.value) || 0;
    });
    document.querySelector("#total_hours").innerText = tot;
}

function generateTableFromObject(loaded_object) {
    console.log(loaded_object);
    let year = loaded_object.year;
    let month = loaded_object.month;
    let table = document.querySelector("tbody");
    table.innerHTML = "";

    let days_in_month = dayjs().month(month-1).daysInMonth()
    loaded_object.days.forEach((element) => {
        if(USE_TWO_TABLES && i > (days_in_month+1)/2 && table == document.querySelector("tbody")){
            table = document.querySelectorAll("tbody")[1];
            table.innerHTML = "";
        }
        let row = table.insertRow();

        let cell = row.insertCell();
        let text = document.createTextNode(element.day_name.capitalize());
        cell.appendChild(text);
        cell.classList.add("day_name");

        cell = row.insertCell();
        text = document.createTextNode(element.day_number);
        cell.appendChild(text);

        cell = row.insertCell();
        cell.innerHTML = `<input type="number" name="hours_input" value="${element.hours||0}" class="form-control hours_input" min="0" />`;
        cell.querySelector("input").addEventListener('change', function (evt) {
            updateHoursTotal();
        });

        cell = row.insertCell(3);
        cell.innerHTML = `<input type="text" class="form-control" value="${element.notes||""}" />`;
    });
}

function generateTable() {
    let year = document.getElementById("year_selector").value;
    let month = document.getElementById("month_selector").value;
    let days_in_month = dayjs().month(month-1).daysInMonth()
    let days = [];
    for (var i = 1; i !== days_in_month+1; i++) {
        days.push({
            day_name: dayjs(i+"-"+month+"-"+year, "D-M-Y").format("dddd").capitalize(),
            day_number: i,
            hours: 0,
            notes: ""
        });
    }
    generateTableFromObject({
        year: year,
        month: month,
        hours_total: 0,
        days: days
    });
}

function checkStorageAndGenerateTable(){
    tot = 0;
    document.querySelector("#total_hours").innerText = tot;
    storage_name = "hours_" + parseInt(document.getElementById("year_selector").value) + "_" + parseInt(document.getElementById("month_selector").value);
    console.log(storage_name);
    let storage_obj = localStorage.getObject(storage_name);
    if(storage_obj === null){
        generateTable();
    } else {
        document.getElementById("year_selector").value = storage_obj.year;
        document.getElementById("month_selector").value = storage_obj.month;
        tot = storage_obj.hours_total;
        document.getElementById("total_hours").innerText = tot;
        generateTableFromObject(storage_obj);
    }
}

function exportHoursAsPlainText(){
    download(JSON.stringify(exportHours()), "json", "application/json");
}

console.log("CI Test");

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#year_selector").value = dayjs().year();
    generateMonthSelector();
    monthSelected();
    document.querySelector("#pageBody").addEventListener('input', function (evt) {
        storage_name = "hours_" + parseInt(document.getElementById("year_selector").value) + "_" + parseInt(document.getElementById("month_selector").value);
        setTimeout(function(){ localStorage.setObject(storage_name, exportHours()); }, 500);
    });
    document.querySelector("#year_selector").addEventListener('change', function (evt) {
        yearSelected();
    });
    document.querySelector("#print").addEventListener('click', function (evt) {
        print();
    });
    document.querySelector("#exportHoursAsPlainText").addEventListener('click', function (evt) {
        exportHoursAsPlainText();
    });
    document.querySelector("#exportHoursAsExcel").addEventListener('click', function (evt) {
        import(/* webpackChunkName: "export_excel" */ './export_excel.js').then(module => {
            module.exportHoursAsExcel();
        });
    });
});

if (module.hot) {
    module.hot.accept();
    console.log(module.hot.status());
    if(module.hot.status() == "apply"){
        console.log("Updating...");
        //generateMonthSelector();
        //checkStorageAndGenerateTable();
        location.reload();
    }
}
