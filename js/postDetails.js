const urlPrams = new URLSearchParams(window.location.search);
const id = urlPrams.get("postId");
// console.log(id);
// ==========================================
// ==========================================
// ==========================================
// ==========================================

getPost();
// ==========================================
function getPost() {
  toggleLoader(true);
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      toggleLoader(false);
      let post = response.data.data;
      let comments = post.comments;
      // =================
      document.getElementById("authorName").innerHTML = post.author.name;
      // =================
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
        post.id,
        post.tags,
        comments
      );
      setupUI();
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error.response.data);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
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
  postId,
  tags,
  comments
) {
  let commentsContent = ``;
  for (comment of comments) {
    commentsContent += `
    <!-- Comment -->
    <div class="comment p-3 m-3 rounded-5">
      <div>
        <img
          src="${comment.author.profile_image}"
          class="Profile-img rounded-circle"
          alt=""
        />
        <b>${comment.author.username}</b>
      </div>
      <hr />
      <div style="padding-left: 1rem">
        ${comment.body}
      </div>
    </div>
    `;
  }

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
  </div>
  <div class="card-body" style="cursor: pointer;">
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
      <span id="post-tags${postId}">
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">
          Policy
        </button>
      </span>
    </div>
    <hr style="margin-bottom: 0;"/>
  </div>
  <!-- Comments -->
  <div id="comments">
  ${commentsContent}
  </div>
  <div id="add-comment-div" class="input-group mb-3 px-3 mt-3">
    <input
      type="text"
      id="add-comment-input"
      class="form-control"
      placeholder="Add Your Comment Here.."
      aria-label="Recipient's username"
      aria-describedby="button-addon2"
    />
    <button
      class="btn btn-outline-success"
      type="button"
      id="button-addon2"
      onclick="writeComment()"
    >
      Send
    </button>
  </div>
</div>
`;
  document.getElementById("post").innerHTML = content;
  // ADD TAGS
  let currentPost = `post-tags${postId}`;
  document.getElementById(currentPost).innerHTML = "";
  for (tag of tags) {
    console.log(tag.name);
    let tagsContent = `
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">
          ${tag.name}
        </button>
    `;
    document.getElementById(currentPost).innerHTML += tagsContent;
  }
}
// ===========================================
// ===========================================
// ===========================================
// ===========================================
function writeComment() {
  toggleLoader(true);
  let commentInput = document.getElementById("add-comment-input").value;
  let token = localStorage.getItem("token");
  // ------------------------------------
  const params = {
    body: commentInput,
  };
  // ------------------------------------
  const headers = {
    authorization: `Bearer ${token}`,
  };
  // ------------------------------------
  // Start Request
  axios
    .post(`${baseUrl}/posts/${id}/comments`, params, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);
      // console.log(response);
      showAlert("Comment Added Successfully");
      getPost();
      // -----------------------
      commentInput = "";
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error);
      showAlert("Can't Add Empty Comment", "danger");
    });
}
