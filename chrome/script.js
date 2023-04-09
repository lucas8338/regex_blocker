/* 
the bellow function is the function of the "addPage_button" this mutton
must to add a new row
*/
document.getElementById("addPage_button").onclick = function(){
    console.log("clicked");
    table = document.getElementById("table");
    actualTime = Date.now();
    row = table.insertRow(table.length);
    row.id = `tableRow_${actualTime}`;
    row.className = `ruleRow`;
    // the "insertCell" function insert a column in a table row
    // this column is completly empty so i need to edit its html
    col1 = row.insertCell(0);
    // edit the html for the col
    col1.innerHTML = `<th><input type="text"></th>`;
    col2 = row.insertCell(1);
    col2.innerHTML = `<th><input type="text"></th>`;
    col3 = row.insertCell(2);
    col3.innerHTML = `<th><input type="text" size="2"></th>`;
    col4 = row.insertCell(3);
    // this will generate the button which will to delete the row
    col4.innerHTML = `<th><button type="button" id="button_${actualTime}" class="delete_button">delete</button></th>`;
    // this declare a function which will be runned when the button above is clicked
    document.getElementById(`button_${actualTime}`).onclick = function(){
        // "this" is a element passed to a function by javascript, this is the
        // data about the caller. to get the data for the row of the button which
        // is being clicked the name of the element of the row contains a number
        // happens in the button too, the row contains id="rableRow_${unixTime}" and
        // the button has id="button_${unixTime}" i'm using this information and just
        // replacing the string "button_" by "tableRow_" and now i have the id of the
        // row of the button which is being clicked. then the rows bellow has the
        // objective of to delete the row.
        rowId = this.id.replace("button_","tableRow_");
        row = document.getElementById(rowId);
        row.remove();
    }
}

updateDeleteButtons = function(){
    buttons = document.getElementsByClassName("delete_button")
    for (let i=0; i<buttons.length; i++){
        buttons[i].onclick = function(){
            console.log("deletebuttonclicked");
            console.log(this);
        }
    }
}