function getFollowers(followers_url, page, count, numFollowers) {
  var show = 20;
  fetch(followers_url + "?per_page="+ show + "&page=" + page)
    .then( function (fL) {return fL.json()})
    .then( function (users) {
      var followers = document.getElementById('followers')


      for(var i = 0; i < users.length; i++) {

        var follower = document.createElement('div')
        follower.setAttribute('class', "follower");

        var followerImage = document.createElement('img');
        followerImage.src = users[i].avatar_url;
        followerImage.setAttribute('class', "followerAvatar");
        followerImage.setAttribute('alt', users[i].login);
        followerImage.setAttribute('title', users[i].login);
        follower.appendChild(followerImage);

        var name = document.createElement('div');
        name.innerText = users[i].login;
        name.setAttribute('class', "followerName");
        follower.appendChild(name);

        follower.setAttribute('onClick',
          `document.getElementById('searchInput').innerText = '${users[i].login}'; getUser();`
        );
        followers.appendChild(follower);
      }

      if (count + users.length < numFollowers) {
          if (count > 0) {
            var more = document.getElementById('MoreLink');
            more.parentElement.removeChild(more);
          }
          else {
            var more = document.createElement('div');
            more.setAttribute('id', "MoreLink");
            more.innerText = "More..."
          }
          count += users.length;
          more.setAttribute('onClick',
            `getFollowers("${followers_url}", ${page+1}, ${count}, ${numFollowers});`);
          document.getElementById('followers').appendChild(more);
        }
      else if (count > 0) {
        var more = document.getElementById('MoreLink');
        more.parentElement.removeChild(more);
        }
    })
}


function loadUser(user) {
  document.getElementById('followers').innerText = "";
  document.getElementById('username').innerText = user.login;
  document.getElementById('userAvatar').src = user.avatar_url;
  document.getElementById('realname').innerText = user.name;
  document.getElementById('location').innerText = user.location;
  document.getElementById('profileLink').href = user.html_url;
  document.getElementById('profileLink').innerText
    = "View GitHub Profile";
  document.getElementById('bio').innerText = user.bio;
  document.getElementById('numFollowers').innerText =
    user.followers + " followers";
  getFollowers(user.followers_url.replace('{*}',''), 1, 0, user.followers);
}

function getUser() {
  text = document.getElementById('searchInput');
  text.innerText = text.innerText.replace(/[^\w\-\_]/g, '');
  name = text.innerText;
  var url = 'https://api.github.com/users/' + name;
  fetch(url)
    .then(function(r) {
      if(!r.ok) throw Error("Could not find user");
      return r.json();
    })
    .then(function(j) {
      loadUser(j);
    })
    .catch(function error(error) {
      alert("Could not find user");
    });
  };

document.getElementById('searchButton').addEventListener('click', function() {
  getUser();
});
document.getElementById('searchInput').addEventListener('paste', function(e) {
  setTimeout(function() {

    var childs = this.children;
    var newString = ""

    for (var i = 0; i < childs.length; i++)
      newString += childs[i].innerText;

    this.innerText = newString.substring(0,20);

    ;}, 0);

});
document.getElementById('searchInput').addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    getUser();
  }
});
document.getElementById('searchInput').innerText = "jennifersalas";
getUser();
