try {
  importScripts('instagram.js', 'notification.js');
} catch (e) {
  console.error("err importScripts: ", e);
}
const igClient = InstagramAPI.new();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getUnfollowers'){
    igClient.unfollowers().then(resp => {
      // No error handling rightNow.
      chrome.storage.local.set({unfollowers: JSON.stringify(resp)}, () => {
        createNotification("Request Done", "unfollowers list ready")
        chrome.action.setBadgeText({text: "1"})
        chrome.action.setBadgeBackgroundColor({color: "red"})
        sendResponse(resp)
      })
    })
  }

  if(request.action === 'unfollowersCache'){
    chrome.storage.local.get(['unfollowers'], result => {
      sendResponse(JSON.parse(result.unfollowers) || [])
    })
  }
  return true
});

