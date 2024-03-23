const baseUrl = "https://tarmeezacademy.com/api/v1";
// https://tarmeezacademy.com/api/v1
setupUI();
/*
=================================================================
*/
// Get Posts
axios.get(`${baseUrl}/posts?limit=2`).then((response) => {
  let posts = response.data.data;
  // console.log(posts);
  document.getElementById("posts").innerHTML = "";
  for (post of posts) {
    let profileImg = post.author.profile_image,
      userName = post.author.username,
      imgSrc = post.image,
      time = post.created_at,
      title,
      body = post.body,
      commentsCount = post.comments_count;
    title = post.title || "";
    createPost(profileImg, userName, imgSrc, time, title, body, commentsCount);
  }
});

function createPost(
  profileImg,
  userName,
  imgSrc,
  time,
  title,
  body,
  commentsCount
) {
  let content = `
<div class="card">
  <div class="card-header">
    <img
      src="${profileImg}"
      alt=""
      class="rounded-circle border border-2"
      style="width: 40px; height: 40px"
    />
    <b>@${userName}</b>
  </div>
  <div class="card-body">
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
        <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">
          Policy
        </button>
      </span>
    </div>
  </div>
</div>
`;
  document.getElementById("posts").innerHTML += content;
  // ADD TAGS
  let currentPost = `post-tags${post.id}`;
  document.getElementById(currentPost).innerHTML = "";
  for (tag of post.tags) {
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
=================================================================
*/
// Login Button ====================
// const loginSubmitBtn = document.getElementById("login-submit-btn");
// loginSubmitBtn.addEventListener("click", () => {
//   loginBtnClicked();
// });
function loginBtnClicked() {
  const userNameInput = document.getElementById("username-input").value;
  const passwordInput = document.getElementById("password-input").value;
  const params = {
    username: userNameInput,
    password: passwordInput,
  };
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => {
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // to close the Modal After Login
      bootstrap.Modal.getInstance(
        document.getElementById("login-modal")
      ).hide();
      setupUI();
      showAlert("logged In Successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}
// ==================
function registerBtnClicked() {
  const nameInput = document.getElementById("register-name-input").value;
  const userNameInput = document.getElementById(
    "register-username-input"
  ).value;
  const passwordInput = document.getElementById(
    "register-password-input"
  ).value;
  const params = {
    username: userNameInput,
    password: passwordInput,
    name: nameInput,
  };
  axios
    .post(`${baseUrl}/register`, params)
    .then((response) => {
      console.log(response.data);
      // localStorage.setItem("token", response.data.token);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      // to close the Modal After Login
      bootstrap.Modal.getInstance(
        document.getElementById("register-modal")
      ).hide();
      setupUI();
      showAlert("New User Register Successfully");
    })
    .catch((error) => {
      console.log(error.response.data);
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
// ==================
function createNewPostClicked() {
  //
}
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
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const addBtn = document.getElementById("add-btn");
  if (token == null) {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    addBtn.style.display = "none";
  } else {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
    addBtn.style.display = "block";
  }
}

// =============
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
      `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
      `</div>`,
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(alertMsg, status);
  // \Todo: Hide THe Alert
  setTimeout(() => {
    const hideAlert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    // hideAlert.close();
  }, 2000);
}
