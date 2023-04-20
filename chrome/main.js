// content_Script

/*
    the script 'removeMatchedContents' takes a array with 
*/
removeMatchedContents = function(data, key){
    // a regex to extract the values inside the brackets "<>"
    // it will match the from the first "<" until the next ">"
    contentExtractReg = new RegExp(`<[^>]*>`, "i");
    body = document.getElementsByTagName("body")[0];
    // get all elements inside the body element
    inBody = body.getElementsByTagName("*");
    for (let i=0; i < inBody.length; i+=1){
        element = inBody[i];
        outerHtml = element.outerHTML;
        elementString = outerHtml.match(contentExtractReg)[0];
        group = data[key][1];
        reg_group = new RegExp(group, "i");
        elementGroupMatch = elementString.match(reg_group);
        if (elementGroupMatch != null){
            if (elementGroupMatch.length > 1){
                contents = data[key][2].split("#|#");
                for (let k=0; k < elementGroupMatch.length - 1; k+=1){
                    content = contents[k];
                    reg_content = new RegExp(content, "i")
                    if (elementGroupMatch[k+1].match(content) != null){
                        element.remove()
                    }
                }
            }
        }
    }
}

/*
    return the keys of the map which match with the url
*/
matchUrl = function(data){
    acceptedKeys = [];
    for (key in data){
        targetUrl = data[key][0];
        reg = new RegExp(targetUrl, "i")
        if (document.URL.match(reg) != null){
            acceptedKeys[acceptedKeys.length] = key;
        }
    }
    return acceptedKeys;
}

// connection required to send messages to background
connection = chrome.runtime.connect()
// a callback trigged when a connection is stablished
chrome.runtime.onConnect.addListener(function(content){})
// a callback trigged when a message is received
chrome.runtime.onMessage.addListener(function(content){
    // run the marchUrl
    matchedUrls = matchUrl(content);
    for (let i = 0; i < matchedUrls.length; i += 1){
        key = matchedUrls[i];
        document.onreadystatechange = function(){
            removeMatchedContents(content, key);
        }
        repeat = content[key][3];
        repeat = parseFloat(repeat);
        if (!isNaN(repeat)){
            setInterval(function(){
                removeMatchedContents(content, key);
            }, repeat);
        }
    }
})

// send the message to the background
// the background will send back the data of the extension storage.
// when the message from the background is received will trigger the row above
// "chrome.runtime.onMessage".
chrome.runtime.sendMessage({"action":"data"})
