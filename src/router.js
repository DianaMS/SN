import { components } from './views/index.js'

export const changeView = (route) => {
  const actualView = document.getElementById('actual-view');
  actualView.innerHTML = '';
  switch (route) {
    case '':
    case '#':
    case '#/log-in':
    case '#/': {
      return actualView.appendChild(components.login());
    }
    case '#/sign-up': {
      actualView.appendChild(components.login());
      const switchModal = actualView.querySelector('#switch-modal');
      switchModal.innerHTML = '';
      return switchModal.appendChild(components.signup());
    }
    case '#/home': {
      return actualView.appendChild(components.home());
    }
    case '#/post-section': {
      actualView.appendChild(components.home());
      const main = actualView.querySelector('#main-container');
      main.innerHTML = '';
      return main.appendChild(components.postForm());
    }
    case '#/profile-form': {
      actualView.appendChild(components.home());
      const main = actualView.querySelector('#main-container');
      main.innerHTML = '';
      main.appendChild(components.postForm());
      const switchForm = actualView.querySelector('#switch-form');
      switchForm.innerHTML = '';
      return switchForm.appendChild(components.profileForm());
    }
    default:
      return actualView.innerHTML = '';
  }
};
