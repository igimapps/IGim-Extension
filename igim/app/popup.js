const ul = document.querySelector(".list-disc.space-y-2")
const unfollowers = response =>{
  ul.innerHTML = ""
  let img = new Image;
  img.loading = "lazy";
  img.crossOrigin = "Anonymous";
  img.classList.add("w-10", "h-10", "rounded-full", "mr-4");
  
  response.forEach(res => {
    img.src = res.profile_pic_url;
    img.alt = "avatar of ${res.full_name}";

    let unfollower = `
      <li class="flex items-start">
        <div class="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-1 flex flex-col justify-between leading-normal">
          <div class="flex items-center">
            ${img.outerHTML}
            <div class="text-sm">
              <p class="text-gray-900 leading-none">
                <a href="https://instagram.com/${res.username}" class="text-xs text-blue-500 font-semibold" target="_blank"> 
                ${res.username} 
                ${!!res.full_name ? `: `+ res.full_name : ""} 
                <a/>
              </p>
            </div>
          </div>
        </div>
      </li>`
    ul.insertAdjacentHTML('beforeend', unfollower)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.action.setBadgeText({text: ""})

  chrome.runtime.sendMessage({action: "unfollowersCache"}, response => {
    if(!!response) unfollowers(response)
  });

  document.onclick = e =>{
    if(e.target.getAttribute('data-unfollow-id')){
      chrome.runtime.sendMessage({action: "unfollow", data:{id: e.target.getAttribute('data-unfollow-id')}}, response => {
        console.log(response);
      });
    }
  }

  let getUnfollowers = document.getElementById("getUnfollowers");
  getUnfollowers.addEventListener("click", async () => {
    
    // Need to add loading/fetching feature
    ul.innerHTML = "<p style='text-align: center'>Loading unfollowers <br/> It may take long, if users list big.</p>"
    getUnfollowers.classList.add("opacity-50", "cursor-not-allowed");
    getUnfollowers.disabled = true;
    
    chrome.runtime.sendMessage({action: "getUnfollowers"}, response => {
      unfollowers(response);
      if(!!response){
        getUnfollowers.classList.remove("opacity-50", "cursor-not-allowed");
        getUnfollowers.disabled = false;
      }
    });
  });
})
