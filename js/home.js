getPosts();

// For Pagination
let currentPage = 1,
  lastPage;
window.addEventListener("scroll", () => {
  let endOfPage =
    window.innerHeight + window.scrollY >=
    document.body.scrollHeight - window.innerHeight;
  //----------------------------------------------------------
  if (endOfPage && currentPage <= lastPage) {
    currentPage += 1;
    getPosts(false, currentPage);
  }
});
//=======================//
/*
=======================
*/
function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
      toggleLoader(false);
      let posts = response.data.data;
      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }
      // Because it there alot of pages
      // lastPage = 2;

      lastPage = response.data.meta.last_page;
      // =================
      posts.forEach((post) => {
        const user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;
        if (isMyPost) {
          editBtnContent = `
        <button class="btn btn-danger ms-2"
          onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
          Delete
        </button>
        <button id="edit-post-btn" class="btn btn-warning ms-2" 
          onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
          Edit 
        </button>`;
        }
        // -----------
        let title;
        title = post.title || "";
        createPost(
          post.author.id,
          post.author.profile_image,
          post.author.username,
          post.image,
          post.created_at,
          title,
          post.body,
          post.comments_count,
          editBtnContent,
          post.id,
          post.tags
        );
      });

      // ================= Old Way
      // for (post of posts) {
      //   const user = getCurrentUser();
      //   let isMyPost = user != null && post.author.id == user.id;
      //   let editBtnContent = ``;
      //   if (isMyPost) {
      //     editBtnContent = `
      //   <button class="btn btn-danger ms-2"
      //     onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
      //     Delete
      //   </button>
      //   <button id="edit-post-btn" class="btn btn-warning ms-2"
      //     onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
      //     Edit
      //   </button>`;
      //   }
      //   // -----------
      //   let title;
      //   title = post.title || "";
      //   createPost(
      //     post.author.profile_image,
      //     post.author.username,
      //     post.image,
      //     post.created_at,
      //     title,
      //     post.body,
      //     post.comments_count,
      //     editBtnContent
      //   );
      // }
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error);
      const errorMessage = error.data.error_message;
      showAlert(errorMessage, "danger");
    });
}
/*
=======================
*/
function createPost(
  authorid,
  profileImg,
  userName,
  imgSrc,
  time,
  title,
  body,
  commentsCount,
  editBtnContent,
  postId,
  tags
) {
  let content = `
<div class="card shadow">
  <div class="card-header d-flex justify-content-between">
    <div onclick="userClicked(${authorid})" style="cursor: pointer;">
      <img
        src="${profileImg}"
        alt=""
        class="rounded-circle border border-2"
        style="width: 40px; height: 40px"
      />
      <b>@${userName}</b>
    </div>
    <div>    
    ${editBtnContent}
    </div>
  </div>
  <div class="card-body" onclick="postClicked(${postId})" style="cursor: pointer;">
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
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;"></button>
      </span>
    </div>
  </div>
</div>
`;
  document.getElementById("posts").innerHTML += content;
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

/*
=======================
*/
// Create New Post
function createNewPostClicked() {
  toggleLoader(true);
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";
  //----------------------
  let titleInput = document.getElementById("post-title-input").value;
  let bodyInput = document.getElementById("post-body-input").value;
  let imageInput = document.getElementById("post-image-input").files[0];
  //------
  let token = localStorage.getItem("token");
  let url = ``;
  // ==============================
  // parms To form data
  let formData = new FormData();
  formData.append("title", titleInput);
  formData.append("body", bodyInput);
  // ==============================
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  let AlertMsg;
  // ==============================
  if (isCreate) {
    url = `${baseUrl}/posts`;
    formData.append("image", imageInput);
    AlertMsg = "Post Added Successfully";
  } else {
    url = `${baseUrl}/posts/${postId}`;
    // To call Put Request has Biuld By PHP  --- & will Set POST In url
    formData.append("_method", "put");
    AlertMsg = "Post Updated Successfully";
    if (imageInput != undefined) {
      formData.append("image", imageInput);
    }
  }
  // Start Request
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);
      // console.log(response);
      // setupUI();
      closeThisModal("create-post-modal");
      showAlert(AlertMsg);
      getPosts();
      resetCreatePostInputs();
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}

// -----------
function addBtnClicked() {
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";

  // To Call The Model From JS Not Html
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
//
function userClicked(userId) {
  location = `./profile.html?userId=${userId}`;
}
