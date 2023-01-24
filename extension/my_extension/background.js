chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("imdb.com/title")) {
  
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
      });
    }
  });
  