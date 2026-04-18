const sheetId = '10Tza0inZjqfrs7bRLzq7Z1r-6mWhk-HITGnDDVVkP_0';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    // Cắt bỏ phần text thừa của Google để lấy đúng chuẩn JSON
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);
    const fs = require('fs');
    fs.writeFileSync('temp.json', JSON.stringify(json, null, 2));
    console.log("Done");
  })
  .catch(err => console.error(err));
