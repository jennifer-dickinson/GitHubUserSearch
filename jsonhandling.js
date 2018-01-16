function getFollowers(followers_url, totalListed) {
  fetch(followers_url)
    .then( function (fL) {return fL.json()})
    .then( function (users) {
      // console.log(users);
      var followers = document.getElementById('followers')

      var traverse = users.length - totalListed > 10 ? 10 : users.length-totalListed;
      var newList = totalListed + traverse;

      console.log("Showing an additional " + traverse + " followers.")

      for(var i = totalListed; i < newList; i++) {

        var follower = document.createElement('div')
        follower.setAttribute('class', "follower");

        var followerImage = document.createElement('img');
        followerImage.src = users[i].avatar_url;
        followerImage.setAttribute('class', "followerImage");
        follower.appendChild(followerImage);

        var name = document.createElement('div');
        name.innerText = users[i].login;
        name.setAttribute('class', "followerName");
        follower.appendChild(name);

        follower.setAttribute('onClick',
          "document.getElementById('srcUser').innerText = " + "'"
          + users[i].login + "'; getUser();"
        );
        // follower.innerText+=users[i].login;
        followers.appendChild(follower);
      }
      if (newList >= users.length && totalListed != 0) {
        var more = document.getElementById('MoreLink');
        more.parentElement.removeChild(more);
      }
      else if (newList < users.length) {
        if (totalListed === 0) {
          var more = document.createElement('div');
          more.setAttribute('id', "MoreLink");
          more.innerText = "More..."
        }
        else {
          var more = document.getElementById('MoreLink');
          more.parentElement.removeChild(more);
        }

        more.setAttribute('onClick',
        "getFollowers('" + followers_url +  "'," +  newList + ");" );
        document.getElementById('followers').appendChild(more);
      }
      console.log( newList + " followers shown. " + (users.length - newList) + " not shown.");
    })
}


function loadUser(user) {
  console.log(user);

  document.getElementById('followers').innerText = "";
  document.getElementById('srcUser').value = user.login;
  document.getElementById('username').innerText = user.login;
  document.getElementById('avatarIMG').src = user.avatar_url;
  document.getElementById('realname').innerText = user.name;
  document.getElementById('location').innerText = user.location;
  document.getElementById('bio').innerText = user.bio;
  document.getElementById('numFollowers').innerText =
    user.followers + " followers";

  var numFL = 0;
  getFollowers(user.followers_url.replace('{*}',''), numFL);
}

function getUser() {
  name = document.getElementById('srcUser').innerText;
  var url = 'https://api.github.com/users/' + name;
  fetch(url)
    .then(function(r) {
      if(!r.ok) throw Error("Could not find user");
      document.getElementById('loadStatus').innerText = "Loading...";
      return r.json();
    })
    .then(function(j) {
      document.getElementById('loadStatus').innerText = "";
      console.log(j);
      loadUser(j);
    })
    .catch(function(error) {
      alert("Could not find user");
      console.log(error);
    });
  };

document.getElementById('search').addEventListener('click', function() {
  getUser();
});
document.getElementById('srcUser').addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    // document.getElementById('srcUser').replace(/\n$/, '');
    e.preventDefault();
    getUser();
  }
});

document.getElementById('srcUser').innerText = "jennifersalas";
getUser();
