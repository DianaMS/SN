import { components } from './views/index.js';

const actualView = document.getElementById('actual-view');
const homeView = document.querySelector('.home-view');
const mainContainer = document.querySelector('#main-container');

export const changeView = (route) => {
  actualView.innerHTML = '';
  switch (route) {
    case '':
    case '#':
    case '#/log-in':
    case '#/': {
      homeView.classList.remove('display-flex');
      return actualView.appendChild(components.login());
    }
    case '#/sign-up': {
      homeView.classList.remove('display-flex');
      actualView.appendChild(components.login());
      const switchModal = actualView.querySelector('#switch-modal');
      switchModal.innerHTML = '';
      return switchModal.appendChild(components.signup());
    }
    case '#/home': {
      homeView.classList.add('display-flex');
      mainContainer.innerHTML = '';
      return mainContainer.appendChild(components.home());
    }
    case '#/post-section': {
      mainContainer.innerHTML = '';
      return mainContainer.appendChild(components.postForm());
    }
    case '#/profile-form': {
      mainContainer.innerHTML = '';
      mainContainer.appendChild(components.postForm());
      const switchForm = document.querySelector('#switch-form');
      switchForm.innerHTML = '';
      return switchForm.appendChild(components.profileForm());
    }
    default:
      return actualView.innerHTML = '';
  }
};
