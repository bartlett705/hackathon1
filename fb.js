/* facebook API bot */
const appConfig = {
  appId: '591425497726548',
  appSecret: '83d27cc8763c1ab6eb2df81b7a65700b',
};

const users = [
  {
    userName: 'Sahil Nayak',
    divId: 'sahilnayak',
    facebookId: '6716397',
  },
  {
    userName: 'Greg Thomas',
    divId: 'gregthomas',
    facebookId: 'creg.thrmas',
    instagramId: 'trysterocoffee',
    twitterId: 'trysterocoffee',
  },
  {
    userName: 'Donald J. Trump',
    divId: 'donaldjtrump',
    instagramId: 'realdonaldtrump',
  },
];

document.getElementById('addButton').addEventListener('click', function() {
  var userName = document.getElementById('userName').value;
  var facebookId = document.getElementById('facebookId').value;
  var instagramId = document.getElementById('instagramId').value;
  var twitterId = document.getElementById('twitterId').value;
  const newUserObj = {
    userName,
    facebookId,
    instagramId,
    twitterId,
  };
  users.push(newUserObj);
  console.log('Added user to Storage:', newUserObj);
  populateUser(newUserObj);
});
document.getElementById('saveButton').addEventListener('click', function saveUsers() {
  chrome.storage.sync.set({'superFriends': users}, function() {
    console.log('saved!');
  });
});
document.getElementById('clearButton').addEventListener('click', function saveUsers() {
  chrome.storage.sync.set({'superFriends': []}, function() {
    console.log('cleared!');
  });
});
function getTwitter(userId, userNode, xhttp) {
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
        let resultImgArray = [];
        // console.log(this.responseText);
        const re = /<img\s+data-aria-label-part\s+src=\\\"([^\\]+)/g;
        const source = JSON.stringify(this.responseText);
        // console.log(source);
        const matches = re.exec(source);
        // console.log(matches);
        const labelNode = document.createElement('p');
        labelNode.setAttribute('class', 'label-node');
        labelNode.innerHTML = 'Twatter';
        userNode.appendChild(labelNode);
        const picNode = document.createElement("img");
        picNode.setAttribute('src', matches[1]);
        picNode.setAttribute('class', 'tw-pic');
        picNode.setAttribute('alt', userId);
        userNode.appendChild(picNode);
        // resultImgArray.push(match);
        // console.log(resultImgArray);
   }
 }
   xhttp.open("GET", `https://twitter.com/${twitterId}/media`, true);
   xhttp.send();
}
function getInsta(userId, userNode, instaReq) {
  const url = `http://instagram.com/${userId}/media`;
  instaReq.open('GET', url);
  instaReq.onload = () => {
    if (instaReq.status >= 200 && instaReq.status < 400) {
      // Success!
      const responseData = JSON.parse(instaReq.responseText);
      console.log(`data from IG:${userId} received and parsed`);
      const labelNode = document.createElement('p');
      labelNode.setAttribute('class', 'label-node');
      labelNode.innerHTML = 'InstaFram';
      userNode.appendChild(labelNode);
      for (var i = 0; i < 6; i++) {
        const picNode = document.createElement("img");
        picNode.setAttribute('src', responseData.items[i].images.low_resolution.url);
        picNode.setAttribute('class', 'insta-pic');
        picNode.setAttribute('alt', responseData.items[i].user.full_name);
        userNode.appendChild(picNode);
      }
    }
  }

  instaReq.onerror = function() {
    // There was a connection error of some sort
    console.log('Connection Error!');
  };
  instaReq.send();
}


function getFacebook(userId, userNode, facebookReq) {
  const url = `https://graph.facebook.com/${userId}?fields=id,name,picture&access_token=${appConfig.appId}|${appConfig.appSecret}`;
  console.log(`contacting facebook for ${userId} on ${url}`);
  facebookReq.open('GET', url);
  facebookReq.onload = () => {
    console.log('FIRING', facebookReq);
    if (facebookReq.status >= 200 && facebookReq.status < 400) {
      // Success!
      const responseData = JSON.parse(facebookReq.responseText);
      console.log(`data from FB for ${userId} received and parsed`);
      const labelNode = document.createElement('p');
      labelNode.setAttribute('class', 'label-node');
      labelNode.innerHTML = 'FaceCrack';
      userNode.appendChild(labelNode);
      const picNode = document.createElement("img");
      picNode.setAttribute('src', responseData.picture.data.url);
      picNode.setAttribute('class', 'fb-pic');
      picNode.setAttribute('alt', responseData.name);
      userNode.appendChild(picNode);
    } else console.log(`error getting facebook for ${userId}`);
  }
  facebookReq.onerror = function() {
    // There was a connection error of some sort
    console.log('Connection Error!');
  };
  facebookReq.send();
}

// WRITE divID Maker

function populateUser(userObj) {
  // Create a request object for each Social Network
  const instaReq = new XMLHttpRequest();
  const facebookReq = new XMLHttpRequest();
  const twittReq = new XMLHttpRequest();
  // create a node for the user and append it to the content div
  const userNode = document.createElement('div');
  userNode.setAttribute('id', userObj.divId);
  userNode.setAttribute('class', 'user-node');
  const nameNode = document.createElement('p');
  nameNode.appendChild(document.createTextNode(userObj.userName));
  nameNode.setAttribute('class', 'name-node');
  userNode.appendChild(nameNode);
  const contentNode = document.getElementById('content');
  contentNode.appendChild(userNode);
  // pass the userNode to individual get reqs for rendering
  if (userObj.facebookId) getFacebook(userObj.facebookId, userNode, instaReq);
  if (userObj.instagramId) getInsta(userObj.instagramId, userNode, facebookReq);
  if (userObj.twitterId) getTwitter(userObj.twitterId, userNode, twittReq);
}
chrome.storage.sync.get('superFriends', function(userArray) {
  console.log(userArray['superFriends']);
  userArray['superFriends'].forEach(user => {
    populateUser(user);
  });
});
