try {
  importScripts('instagram.js');
} catch (e) {
  console.error("err importScripts: ", e);
}
const igClient = InstagramAPI.new();
const cache = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getUnfollowers'){
    igClient.unfollowers().then(resp =>{
      Object.assign(cache, {unfollowers: resp})
      sendResponse(resp)
    })
  }

  if(request.action === 'unfollow'){
    // igClient.unfollow()
    sendResponse("unfollow")
  }

  if(request.action === 'unfollowersCache'){
    sendResponse(cache.unfollowers)
  }
  return true
});
