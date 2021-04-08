import * as ExcelJS from 'exceljs';
import ExcelTemplate from '../template.xlsx';

import { dayjs, notyf, download, exportHours } from './utils.js';
console.log(dayjs);

const USE_TWO_TABLES_EXCEL = false;

export function exportHoursAsExcel(){
    try {
        fetch(ExcelTemplate)
        .then((response) => {
            if(!response.ok){
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(async (buffer) => {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            //workbook.creator = 'Conteggio Ore Online';
            //workbook.lastModifiedBy = 'Conteggio Ore Online';
            workbook.created = new Date();
            workbook.modified = new Date();
            console.log("Loaded excel file");
            console.log(workbook);

            const worksheet = workbook.worksheets[0];
            console.log(worksheet);

            worksheet.getCell("B1").value = dayjs().month(document.getElementById("month_selector").value-1).format("MMMM").capitalize();
            worksheet.getCell("C1").value = parseInt(document.getElementById("year_selector").value);
            worksheet.getCell("C36").value = parseFloat(document.getElementById("total_hours").innerText);

            const exportedHours = exportHours();
            let day_names = [];
            let day_numbers = [];
            let hours = [];
            let notes = [];

            exportedHours.days.forEach((hour) => {
                day_names.push(hour.day_name);
                day_numbers.push(parseInt(hour.day_number));
                hours.push(parseFloat(hour.hours));
                notes.push(hour.notes);
            });
            console.log(day_names);
            
            if(USE_TWO_TABLES_EXCEL){
                //Not updated, because not required anymore
                const list_half = Math.ceil(day_names.length / 2);
                worksheet.getColumn(2).values = [,,,,,,].concat(day_names.splice(0, list_half));
                worksheet.getColumn(3).values = [,,,,,,].concat(day_numbers.splice(0, list_half));
                worksheet.getColumn(4).values = [,,,,,,].concat(hours.splice(0, list_half));
                worksheet.getColumn(5).values = [,,,,,,].concat(notes.splice(0, list_half));

                worksheet.getColumn(8).values = [,,,,,,].concat(day_names.splice(-list_half));
                worksheet.getColumn(9).values = [,,,,,,].concat(day_numbers.splice(-list_half));
                worksheet.getColumn(10).values = [,,,,,,].concat(hours.splice(-list_half));
                worksheet.getColumn(11).values = [,,,,,,].concat(notes.splice(-list_half));
            } else {
                worksheet.getColumn(1).values = [,,,,].concat(day_names);
                worksheet.getColumn(2).values = [,,,,].concat(day_numbers);
                worksheet.getColumn(3).values = [,,,,].concat(hours);
                worksheet.getColumn(4).values = [,,,,].concat(notes);
                let day_rows = 31;
                let day_month = dayjs().month(exportedHours.month-1).daysInMonth();
                while (day_rows !== day_month) {
                    worksheet.spliceRows(day_rows+3, 1);
                    day_rows--;
                }
            }

            const buffer_download = await workbook.xlsx.writeBuffer();
            const bytes = new Uint8Array(buffer_download);
            download(bytes, "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        })
        .catch((err) => {
            console.error(err);
        });
    } catch (error) {
        console.error(error);
    }
}