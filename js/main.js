const baseUrl = "https://tarmeezacademy.com/api/v1";
// ============================================================
setupUI();
toggleLoader(false);
/*
=================================================================
*/
function profileClicked() {
  const user = getCurrentUser();
  location = `./profile.html?userId=${user.id}`;
}
/*
=================================================================
*/
// Login Button ====================

function loginBtnClicked() {
  toggleLoader(true);
  const userNameInput = document.getElementById("username-input").value;
  const passwordInput = document.getElementById("password-input").value;
  const params = {
    username: userNameInput,
    password: passwordInput,
  };
  // Start Request
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => {
      toggleLoader(false);
      // console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // to close the Modal After Login
      closeThisModal("login-modal");
      setupUI();
      showAlert("logged In Successfully");
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error);
    });
}

// ==================
// ==================
function registerBtnClicked() {
  toggleLoader(true);
  const nameInput = document.getElementById("register-name-input").value;
  const userNameInput = document.getElementById(
    "register-username-input"
  ).value;
  const passwordInput = document.getElementById(
    "register-password-input"
  ).value;
  const profileImageInput = document.getElementById("register-image-input")
    .files[0];

  // ==================

  let formData = new FormData();
  formData.append("name", nameInput);
  formData.append("username", userNameInput);
  formData.append("password", passwordInput);
  formData.append("image", profileImageInput);
  // =================

  // Start Request
  axios
    .post(`${baseUrl}/register`, formData)
    .then((response) => {
      toggleLoader(false);
      // console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // to close the Modal After Login
      closeThisModal("register-modal");
      setupUI();
      showAlert("New User Register Successfully");
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error.response.data);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}

// ==================
// ==================
// ==================
// ===================================
// Logout Button ====================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("logged Out Successfully");
}
// ===================================

// Setup UI ====================
function setupUI() {
  const token = localStorage.getItem("token");
  const addBtn = document.getElementById("add-btn");
  const loggedinDiv = document.getElementById("on-logged-in");
  const loggedoutDiv = document.getElementById("on-logged-out");
  const addComment = document.getElementById("add-comment-div");
  const editBtn = document.getElementById("edit-post-btn");
  //

  if (token == null) {
    loggedoutDiv.style.cssText = "display: flex !important;";
    loggedinDiv.style.cssText = "display: none !important;";
    if (addBtn !== null) {
      addBtn.style.display = "none";
    }
    if (addComment !== null) {
      addComment.style.display = "none";
    }
  } else {
    loggedinDiv.style.cssText = "display: flex !important;";
    loggedoutDiv.style.cssText = "display: none !important;";
    if (addBtn !== null) {
      addBtn.style.display = "block";
    }
    if (addComment !== null) {
      addComment.style.display = "flex";
    }
    // ---------------------------
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
    // .setAttribute("src", user.profile_image);
  }
}
// Get User Info
function getCurrentUser() {
  let user = null;
  const storageuser = localStorage.getItem("user");
  if (storageuser !== null) {
    user = JSON.parse(storageuser);
  }
  return user;
}

// =============
// =============
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
      // setupUI();
      closeThisModal("create-post-modal");
      showAlert(AlertMsg);
      getPosts();
      resetCreatePostInputs();
    })
    .catch((error) => {
      toggleLoader(false);
      console.log(error);
      const errorMessage = error.data.error_message;
      showAlert(errorMessage, "danger");
    });
}
// Edit Post
function editPost(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  // ---------------------------------
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";

  // To Call The Model From JS Not Html
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
// Delete Post
function deletePost(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();

  // =====================
}
// Confirm Delete Post
function confirmPostDelete() {
  let postId = document.getElementById("delete-post-id-input").value;
  // ==============================
  url = `${baseUrl}/posts/${postId}`;
  let token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      // console.log(response);
      closeThisModal("delete-post-modal");
      showAlert("The Has Been Deleted");
      getPosts();
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
// Open the Post
function postClicked(postId) {
  location = `./post_details.html?postId=${postId}`;
}
// =============
// =============
// =============
function showAlert(alertMsg, status = "success") {
  const alertPlaceholder = document.getElementById("success-alert");

  const alert = (message, type) => {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `<div>${message}</div>`,
      `<button id="alert-close-btn" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
      `</div>`,
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(alertMsg, status);
  // LastTodo: Hide THe Alert
  setTimeout(() => {
    document.getElementById("alert-close-btn").click();

    // Fault Way ===================
    // const hideAlert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    // hideAlert.close();
  }, 3500);
}
// ===================================

function closeThisModal(modalId) {
  bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
}
function resetCreatePostInputs() {
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  document.getElementById("post-image-input").value = "";
}
//
//
//
//
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
