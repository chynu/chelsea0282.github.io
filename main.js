function parsePost(text) {
  var lines = text.split("\n");
  var details = {};
  for (var i = 0; i < lines.length; i++) {
    var colon = lines[i].indexOf(":");
    if (colon >= 0) {
      var key = lines[i].substring(0, colon).trim().toLowerCase();
      var value = lines[i].substring(colon + 1).trim();
      details[key] = value;
    }
    if (lines[i] == "") {
      details.content = lines.slice(i + 1).join("\n");
      break;
    }
  }
  return details;
}

function buildPost(post) {
  var postElement = document.createElement("div");
  postElement.className = "post";

  var imgElement = document.createElement("div");
  imgElement.className = "post-image";

  var titleElement = document.createElement("div");
  titleElement.className = "post-title";

  var shortElement = document.createElement("div");
  shortElement.className = "post-short";

  var contentElement = document.createElement("div");
  contentElement.className = "post-content";

  var req = new XMLHttpRequest();
  req.open("GET", "posts/" + post.file, true);
  req.addEventListener("load", () => {
    var postDetails = parsePost(req.responseText);
    titleElement.innerHTML = postDetails.title;
    var image = document.createElement("img");
    image.src = postDetails.image;
    imgElement.appendChild(image);
    shortElement.innerHTML = postDetails.short;
    contentElement.innerHTML = postDetails.content;

    postElement.addEventListener("click", () => {
      postElement.classList.add("expanded");
    });
    imgElement.addEventListener("click", () => {
      if (postElement.classList.contains("expanded")) {
        location.assign(postDetails.link);
      }
    });
    contentElement.addEventListener("click", (e) => {
      if (postElement.classList.contains("expanded")) {
        postElement.classList.remove("expanded");
        e.stopPropagation();
      }
    });
  });
  req.send();

  postElement.appendChild(imgElement);
  postElement.appendChild(titleElement);
  postElement.appendChild(shortElement);
  postElement.appendChild(contentElement);

  return postElement;
}

function loadPosts(current_post) {
  var req = new XMLHttpRequest();
  req.open("GET", "posts/posts.json", true);
  req.addEventListener("load", () => {
    try {
      var posts = JSON.parse(req.responseText);
      // show all posts
      var blogContainer = document.querySelector(".blog");
      for (var i = 0; i < posts.length; i++) {
        var postElement = buildPost(posts[i]);
        blogContainer.appendChild(postElement);
        if (current_post == posts[i].file.substring(posts[i].file.lastIndexOf("."))) {
          postElement.classList.add("expanded");
        }
      }
    } catch (e) {
      document.querySelector(".blog .error").style.display = "block";
    }
  });
  req.send();
}
