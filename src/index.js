import { changeView } from './router.js';

// Initialize Firebase
// const db = firebase.firestore();
// const storage = firebase.storage();

const init = () => {
  changeView(window.location.hash);
  window.addEventListener('hashchange', () => {
    changeView(window.location.hash);
  });
};

window.addEventListener('load', init);
