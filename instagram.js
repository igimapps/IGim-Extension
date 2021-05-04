const InstagramAPI = (() => {
  const url = "https://instagram.com";
  const domain = ".instagram.com";

  const _comparePrivate = (followers, following) => {
    const hashedFollowers = {};
    followers.forEach((user) => hashedFollowers[user.username] = true);
    let unfollowers = following.filter((user) => !hashedFollowers[user.username]);
    return unfollowers
  }

  const _loggedIn = () => {
    // let res = await fetch(`https://www.instagram.com/${username}/?__a=1`)
    // res = await res.json()
    // let userId = res.graphql.user.id
    return new Promise((resolve, reject) => {
      chrome.cookies.get({name: "sessionid", url }, sessionId => {
        if(sessionId) chrome.cookies.get({name: "ds_user_id", url }, userId => resolve(userId.value))
      })
    }).then(resp => resp)
  }

  class InstagramAPI {
    constructor(){
      this.user = {}
      this.authorize()
    }

    static new(){
      return new this()
    }

    authorize = () => {
      _loggedIn().then( id => this.user = {id} )
    }

    unfollow = async () => {
      let id = "5779924297"

      const response = await fetch(`https://www.instagram.com/web/friendships/${id}/unfollow/`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-ig-app-id': '936619743392459'

          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      console.log('response.json() :>> ', response.json());
      // return response.json(); // parses JSON response into native JavaScript objects
    }

    follow = async () => {
      id = "5779924297"
      `https://www.instagram.com/web/friendships/${id}/follow/`
    }

    unfollowers = async () => {
      let followers = [], followings = [] 
      console.log('this.user.id :>> ', this.user.id);
      if (!this.user.id) return "not signed in"

      try {
        let after = null, has_next = true
        while (has_next) {
          await fetch(`https://www.instagram.com/graphql/query/?query_hash=5aefa9893005572d237da5068082d8d5&variables=` + encodeURIComponent(JSON.stringify({
            id: this.user.id,
            include_reel: true,
            fetch_mutual: false,
            first: 50,
            after: after
          }))).then(res => res.json()).then(res => {
            has_next = res.data.user.edge_followed_by.page_info.has_next_page
            after = res.data.user.edge_followed_by.page_info.end_cursor
            followers = followers.concat(res.data.user.edge_followed_by.edges.map(({node}) => {
              return {
                id: node.id,
                username: node.username,
                full_name: node.full_name,
                profile_pic_url: node.profile_pic_url,
                followed_by_viewer: node.followed_by_viewer, //bool
                follows_viewer: node.follows_viewer, //bool
                is_private: node.is_private, //bool
                is_verified: node.is_verified, //bool
                requested_by_viewer: node.requested_by_viewer, //bool
              }
            }))
          })
        }
      
        has_next = true
        after = null
        while (has_next) {
          await fetch(`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=` + encodeURIComponent(JSON.stringify({
            id: this.user.id,
            include_reel: true,
            fetch_mutual: false,
            first: 50,
            after: after
          }))).then(res => res.json()).then(res => {
            has_next = res.data.user.edge_follow.page_info.has_next_page
            after = res.data.user.edge_follow.page_info.end_cursor
            followings = followings.concat(res.data.user.edge_follow.edges.map(({node}) => {
              return {
                id: node.id,
                username: node.username,
                full_name: node.full_name,
                profile_pic_url: node.profile_pic_url,
                followed_by_viewer: node.followed_by_viewer, //bool
                follows_viewer: node.follows_viewer, //bool
                is_private: node.is_private, //bool
                is_verified: node.is_verified, //bool
                requested_by_viewer: node.requested_by_viewer, //bool
              }
            }))
          })
        }
      } catch (err) {
        console.log('err unfollowers: ', err)
      }
      return _comparePrivate(followers, followings)
    }
  }
  return InstagramAPI;
})();
