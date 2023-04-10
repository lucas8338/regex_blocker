// content_Script

/*
    the script 'removeMatchedContents' takes a array with regexes and will
    remove all element in the page which match any one these regex.
*/
removeMatchedContents = function(regxs){
    // a regex to extract the values inside the brackets "<>"
    // it will match the from the first "<" until the next ">"
    contentExtractReg = new RegExp(`<[^>]*>`, "i");
    body = document.getElementsByTagName("body")[0];
    // get all elements inside the body element
    inBody = body.getElementsByTagName("*");
    for (let i=0; i < inBody.length; i++){
        element = inBody[i];
        outerHtml = element.outerHTML;
        elementString = outerHtml.match(contentExtractReg)[0];
        for (let j=0; j < regxs.length; j++){
            actual_regx = regxs[j];
            if (elementString.match(actual_regx) != null){
                element.remove();
            }
        }
    }
}

/*
    check if the url matches any of the urls selected in the first index of
    data "data[n][0]" is suppose to be a regex for the url, if the regex
    is match, will run the function "removeMatchedContents"
*/
matchUrl = function(data){
    console.log("in search")
    for (key in data){
        targetUrl = data[key][0];
        if (targetUrl == ``){continue};
        reg_targetUrl = new RegExp(targetUrl, "i");
        if (document.URL.match(reg_targetUrl) != null){
            console.log(`page match url on "${targetUrl}" running regex_blocker...`)
            // get the contents "data[n][1]"then split the regex of the contents
            // by the separator "#|#".
            targetContents = data[key][1].split("#|#");
            // a array to store the returns of the RegExp() struc
            var reg_targetContents = [];
            for (let i=0; i < targetContents.length; i++){
                actual_targetContents = targetContents[i];
                if (actual_targetContents == ``){continue};
                reg_targetContents[reg_targetContents.length] = new RegExp(actual_targetContents, "i");
            }
            if (reg_targetContents.length == 0){break}
            removeMatchedContents(reg_targetContents);
            // some pages generate contents dinamicaly then is needed to run the
            // script again, the code bellow will get the value of the third column
            // of the row then will repeat the 'removeMatchedContents' by that value
            // as integer.
            repeatInterval = data[key][2];
            repeatInterval = parseInt(repeatInterval);
            // only run again if the variable "repeatInterval" is not NaN
            // will be nan if the column is empty or a character cant be converted to int.
            if (!isNaN(repeatInterval)){
                setInterval(function(){
                    removeMatchedContents(reg_targetContents);
                }, repeatInterval);
            }
        }
    }
}

// connection required to send messages to background
connection = chrome.runtime.connect()
// a callback trigged when a connection is stablished
chrome.runtime.onConnect.addListener(function(content){})
// a callback trigged when a message is received
chrome.runtime.onMessage.addListener(function(content){
    // run the marchUrl
    matchUrl(content);
})

// send the message to the background
// the background will send back the data of the extension storage.
// when the message from the background is received will trigger the row above
// "chrome.runtime.onMessage".
chrome.runtime.sendMessage({"action":"data"})
