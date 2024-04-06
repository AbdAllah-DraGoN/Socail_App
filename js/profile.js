const urlPrams = new URLSearchParams(window.location.search);
let userId = urlPrams.get("userId");
setupUI();
getUser();
getPosts();
// ===========================
function getUser() {
  axios.get(`${baseUrl}/users/${userId}`).then((response) => {
    const user = response.data.data;
    // Set User Data
    document.getElementById("profile-header-img").src = user.profile_image;
    document.getElementById("profile-username").innerHTML = user.username;
    document.getElementById("profile-name").innerHTML = user.name;
    document.getElementById("profile-email").innerHTML = user.email;
    document.getElementById("profile-posts-count").innerHTML = user.posts_count;
    document.getElementById("profile-comments-count").innerHTML =
      user.comments_count;
    document.getElementById("owner-name").innerHTML = user.name;
  });
}
// ===========================
// ===========================
function getPosts() {
  axios.get(`${baseUrl}/users/${userId}/posts`).then((response) => {
    let posts = response.data.data;
    document.getElementById("user-posts").innerHTML = "";
    // =================
    for (post of posts) {
      const user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editBtnContent = ``;
      if (isMyPost) {
        editBtnContent = `
        <button class="btn btn-danger ms-2" style="float: right" 
          onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
          Delete
        </button>
        <button id="edit-post-btn" class="btn btn-warning ms-2" style="float: right" 
          onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
          Edit 
        </button>`;
      }
      // -----------
      let title;
      title = post.title || "";
      createPost(
        post.author.profile_image,
        post.author.username,
        post.image,
        post.created_at,
        title,
        post.body,
        post.comments_count,
        editBtnContent
      );
    }
  });
}
/*
=======================
*/
function createPost(
  profileImg,
  userName,
  imgSrc,
  time,
  title,
  body,
  commentsCount,
  editBtnContent
) {
  let content = `
<div class="card shadow">
  <div class="card-header">
    <img
      src="${profileImg}"
      alt=""
      class="rounded-circle border border-2"
      style="width: 40px; height: 40px"
    />
    <b>@${userName}</b>
    ${editBtnContent}
  </div>
  <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
    <img src="${imgSrc}" alt="" class="w-100" />
    <h6 class="mt-1" style="color: rgb(165, 165, 165)">
    ${time}
    </h6>
    <h5>${title}</h5>
    <p>
    ${body}
    </p>
    <hr />
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-pen"
        viewBox="0 0 16 16"
      >
        <path
          d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
        />
      </svg>
      <span>(${commentsCount}) Comments</span>
      <span id="post-tags${post.id}">
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;"></button>
      </span>
    </div>
  </div>
</div>
`;
  document.getElementById("user-posts").innerHTML += content;
  // ADD TAGS
  let currentPost = `post-tags${post.id}`;
  document.getElementById(currentPost).innerHTML = "";
  for (tag of post.tags) {
    let tagsContent = `
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">
          ${tag.name}
        </button>
    `;
    document.getElementById(currentPost).innerHTML += tagsContent;
  }
}
