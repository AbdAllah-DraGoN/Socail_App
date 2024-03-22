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
    </div>
  </div>
</div>
`;
  document.getElementById("posts").innerHTML += content;
}
/*
=================================================================
*/
// Login Button ====================
const loginSubmitBtn = document.getElementById("login-submit-btn");
loginSubmitBtn.addEventListener("click", () => {
  loginBtnClicked();
});
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
      showSuccessAlert("logged In Successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}
// ===================================
// Logout Button ====================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showSuccessAlert("logged Out Successfully");
}
// ===================================

// Setup UI ====================
function setupUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  if (token == null) {
    loginBtn.style.visibility = "visible";
    registerBtn.style.visibility = "visible";
    logoutBtn.style.display = "none";
  } else {
    loginBtn.style.visibility = "hidden";
    registerBtn.style.visibility = "hidden";
    logoutBtn.style.display = "block";
  }
}

// =============
// =============
// =============
// =============
function showSuccessAlert(alertMsg) {
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
  alert(alertMsg, "success");
  // \Todo: Hide THe Alert
  setTimeout(() => {
    const hideAlert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    // hideAlert.close();
  }, 2000);
}
