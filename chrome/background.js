
// function will get data from the extension storage and return the its data
// as this is a async function its return will be a promisse
// cause async function always return a promisse.
getData = async function(){
    data = chrome.storage.sync.get();
    return data;
}

// callback will be trigged when a connection is stablished
chrome.runtime.onConnect.addListener(function(content){});

// callback will be trigged when a message is received. this
// will send to the "sender" the data (storage) of the extension.
// in this case is suppose the sender be a content_script then
// then it will use the module "tabs" to send a message to a tab (web page).
chrome.runtime.onMessage.addListener(async function(content, sender){
    // contains the id of the tab (window (browser's tab) which the site is opened).
    tabId = sender.tab.id

    data = await getData()

    connection = chrome.tabs.connect(tabId)
    
    chrome.tabs.sendMessage(tabId, data)
})
