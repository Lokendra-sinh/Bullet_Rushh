const authenticateBtn = document.querySelector(".authenticate-button");
const profileBtn = document.querySelector(".profile");
const formToggleText = document.querySelector(".form-toggle-text");
const formToggleBtn = document.querySelector(".form-toggle-button");
const authModal = document.querySelector(".authModal");

let isSignUp = false;
let isModalOpen = false;
authModal.style.display = "none";

function handleAuthModalVisibility(){
    authModal.style.display = isModalOpen ? 'flex' : 'none';
}

function handleFormVisibility(){
    formToggleBtn.textContent = isSignUp ? 'sign up' : 'log in';
    formToggleText.textContent = isSignUp ? `Don't have an account?` : `Already have an account?`;
    signupForm.style.display = isSignUp ? 'flex' : 'none';
    loginForm.style.display = isSignUp ? 'none' : 'flex'; // Assuming login form should hide when sign up is selected
}

authenticateBtn.addEventListener("click", () => {
 isModalOpen = !isModalOpen;
 isSignUp = !isSignUp;
 handleAuthModalVisibility();
});

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the default form submission behavior
    extractSignupFormValues();
  });

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the default form submission behavior
    extractLoginFormValues();
  });

  formToggleBtn.addEventListener('click', () => {
    isSignUp = !isSignUp;
    handleFormVisibility();
  });


function extractSignupFormValues() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  console.log("Signup Form Values:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Password:", password);
}

function extractLoginFormValues() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  console.log("Login Form Values:");
  console.log("Email:", email);
  console.log("Password:", password);
}
