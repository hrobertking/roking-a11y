chrome.webNavigation.onCompleted.addListener(function(details) {
  /**
   * details:
   *   {integer} tabId - ID of the tab in which navigation occurs
   *   {string} url
   *   {integer} processId - ID of the process that runs the renderer for the frame
   *   {integer} frameId - ID of the frame in which navigation occurs; 0 indicates no frame
   *   {double} timeStamp - time when the document finished loading (ms from epoch)
   */
  chrome.tabs.get(details.tabId, function(tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'get_body'}, function(content) {
      const readability = new Readability(content);
      chrome.tabs.sendMessage(tab.id, { text: 'set_score', score: readability.avg });
    });
  });
});
