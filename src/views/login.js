import {
  logIn, recoverPassword, logInFacebook,
  logInGoogle,
} from '../firebase/auth.js';

export const login = () => {
  const div = document.createElement('div');
  div.id = 'login-signup-view';
  const loginView = `
  <img class="cover-app-photo" src="images/cover.png" alt="cover photo">
  <img class="cover-desktop-photo" src="images/coverDesktop.png" alt="cover photo">
  <div id="switch-modal">
    <div id="login-modal">
      <header>
        <h1 class="h1-style"><img src="images/logo.png" alt="app logo"> BUNKER</h1>
        <h2>Share your knowledgement!</h2>
        <h3>WELCOME!</h3>
      </header>
      <main>
        <form id="login-form">
          <input type="email" id="login-email" placeholder="email" required>
          <input type="password" id="login-password" autocomplete="on" placeholder="password" required>
          <p id="error-message"></p>
          <p  class="p-form" id="forgot-password-button">forgot password?</p>
          <button>LOG IN</button>
        </form>
        <p class="p-form">or login with...</p>
        <div class = "googleAndFacebookicons">
          <i class="fab fa-google"></i>
          <i class="fab fa-facebook-f"></i>
        </div>
        <p class="p-form">Don't have an account? <a href="#/sign-up">SIGN UP HERE</a> </p>
      </main>
    </div>
  </div>`;
  div.innerHTML = loginView;
  // LOG IN USER
  const errorMessage = div.querySelector('#error-message');
  const loginForm = div.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    const userEmail = loginForm['login-email'].value;
    const userPassword = loginForm['login-password'].value;
    e.preventDefault();
    logIn(userEmail, userPassword)
      .then(() => {
        errorMessage.innerHTML = '';
        window.location.hash = '/home';
      })
      .catch((err) => { errorMessage.innerHTML = err.message; });
  });
  // GOOGLE LOG IN
  const signinGoogle = div.querySelector('.fa-google');
  signinGoogle.addEventListener('click', logInGoogle);
  // FACEBOOK LOG IN
  const signinFacebook = div.querySelector('.fa-facebook-f');
  signinFacebook.addEventListener('click', logInFacebook);
  // RECOVER PASSWORD
  const forgotPasswordButton = div.querySelector('#forgot-password-button');
  forgotPasswordButton.addEventListener('click', () => {
    const userEmail = loginForm['login-email'].value;
    errorMessage.innerHTML = '';
    recoverPassword(userEmail)
      .then(() => { errorMessage.innerHTML = ''; })
      .catch((err) => { errorMessage.innerHTML = err.message; });
  });
  return div;
};
