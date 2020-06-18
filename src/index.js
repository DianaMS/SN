import { logout } from './firebase/auth.js';
import { changeView } from './router.js';

const init = () => {
  changeView(window.location.hash);
  window.addEventListener('hashchange', () => {
    changeView(window.location.hash);
  });
};

window.addEventListener('load', init);

// DISPLAY MENU
const settingsButton = document.querySelector('.fa-cog');
const menu = document.querySelector('.menu-nav');
settingsButton.addEventListener('click', () => {
  menu.classList.toggle('display-flex');
});
// LOG OUT
const logOutButton = document.querySelector('#log-out');
logOutButton.addEventListener('click', () => {
  logout();
  window.location.hash = '#/log-in';
});
