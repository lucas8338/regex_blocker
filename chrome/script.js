/* 
the bellow function is the function of the "addPage_button" this mutton
must to add a new row
*/
document.getElementById("addRule_button").onclick = function(){
    table = document.getElementById("ruleTable");
    nRows = document.getElementsByClassName("ruleRow").length
    row = table.insertRow(table.length);
    row.id = `tableRow${nRows}`;
    row.className = `ruleRow`;
    // the "insertCell" function insert a column in a table row
    // this column is completly empty so i need to edit its html
    col1 = row.insertCell(0);
    // edit the html for the col
    col1.innerHTML = `<th><input type="text" id="col_${row.id}_0" class="col0"></th>`;
    col2 = row.insertCell(1);
    col2.innerHTML = `<th><input type="text" id="col_${row.id}_1" class="col1"></th>`;
    col2 = row.insertCell(2);
    col2.innerHTML = `<th><input type="text" id="col_${row.id}_2" class="col2"></th>`;
    col3 = row.insertCell(3);
    col3.innerHTML = `<th><input type="text" size="2" id="col_${row.id}_3" class="col3"></th>`;
    col4 = row.insertCell(4);
    // this will generate the button which will to delete the row
    col4.innerHTML = `<th><button type="button" id="deleteButton${nRows}" class="delete_button">delete</button></th>`;
    // this declare a function which will be runned when the button above is clicked
    document.getElementById(`deleteButton${nRows}`).onclick = function(){
        // "this" is a element passed to a function by javascript, this is the
        // data about the caller. to get the data for the row of the button which
        // is being clicked the name of the element of the row contains a number
        // happens in the button too, the row contains id="tableRow${nRow}" and
        // the button has id="deleteButton${nRow}" i'm using this information and just
        // replacing the string "deleteButton" by "tableRow" and now i have the id of the
        // row of the button which is being clicked. then the rows bellow has the
        // objective of to delete the row.
        rowId = this.id.replace("deleteButton","tableRow");
        toDeleteRow = document.getElementById(rowId);
        toDeleteRow.remove();
    }
}

// the row bellow will save the content in each row in the browser storage
// the reason cause i'm using async is to use the "await" keyword to wait for
// promisse to finish.
document.getElementById("save_button").onclick = async function(){
    rows = document.getElementsByClassName("ruleRow");
    // remove all elements in the storage
    await chrome.storage.sync.clear();
    for (let i=0; i<rows.length; i++){
        // the key of the map
        key = rows[i].id;
        // you can to acess the columns inside a table row using the attribute "cells"
        cols = rows[i].cells;
        // i'm using ".lastChild" cause i want to get the "button" element
        // which is inside the cell (is a child of the cell).
        urlRule = cols[0].lastChild.value.normalize();
        groupRule = cols[1].lastChild.value.normalize();
        contentRule = cols[2].lastChild.value.normalize();
        repeat = cols[3].lastChild.value.normalize();
        toSave = {};
        toSave[key] = [urlRule, groupRule, contentRule, repeat];
        // save the data in the browser storage, this will use the sync storage
        // so this will sync with the account
        // the chrome stores a map (json).
        await chrome.storage.sync.set(toSave);
    }
    alert("saved.");
}

// this function is async cause it is required to use the keyword "await" which will
// to wait for a promisse to complete, cause chrome storage returns a promisse.
// this function has the objective to fill all camps in the extension.
load = async function(){
    // await will wait for the promisse to end.
    storage = await chrome.storage.sync.get();
    // iterage for each key name in the map in the storage.
    for (const key in storage){
        actualArray = storage[key];
        // do a click in the "addRule_button"
        document.getElementById("addRule_button").click();
        rows = document.getElementsByClassName("ruleRow");
        row = rows[rows.length - 1];
        for (let j=0; j<4; j++){
            cell = row.querySelector(`.col${j}`);
            cell.value = actualArray[j];
        }
    }
}

load();
