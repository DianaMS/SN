import {
  registerUserEmail, verificationEmail,
} from '../firebase/auth.js';
import { updateUserProfile } from '../firebase/profile.js';

export const signup = () => {
  const div = document.createElement('div');
  div.id = 'signup-modal';
  const signupView = `
  <header>
    <h1 class="h1-style"><img src="images/logo.png" alt="app logo"> BUNKER</h1>
    <h2>Share your knowledgement!</h2>
    <h3>WELCOME!</h3>
  </header>
  <main>
    <form id="signup-form">
      <input type="text" id="signup-username" placeholder="username" required>
      <input type="email" id="signup-email" placeholder="email" required>
      <input type="password" id="signup-password" placeholder="password" required>
      <div>
        <input type="checkbox" id="agreement" required>
        <label for="agreement">I agree to the Terms of Service and Privacy Statement</label>
      </div>
      <p id="error-message"></p>
      <button>SIGN UP</button>
    </form>
    <p class="p-form">Already have an account? <a href="#/log-in">LOG IN HERE</a></p>
  </main>`;
  div.innerHTML = signupView;
  // USER SIGN UP
  const signupForm = div.querySelector('#signup-form');
  const errorMessage = div.querySelector('#error-message');
  signupForm.addEventListener('submit', (e) => {
    const userEmail = signupForm['signup-email'].value;
    const userPassword = signupForm['signup-password'].value;
    const userName = signupForm['signup-username'].value;
    e.preventDefault();
    registerUserEmail(userEmail, userPassword)
      .then(() => {
        updateUserProfile(userName);
        verificationEmail();
        errorMessage.innerHTML = '';
        window.location.hash = '/home';
      })
      .catch((err) => { errorMessage.innerHTML = err.message; });
  });
  return div;
};
