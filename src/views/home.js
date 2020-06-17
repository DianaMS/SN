import { logout, currentUser } from '../firebase/auth.js';

export const home = () => {
  const div = document.createElement('div');
  div.id = 'home-view';
  const homeView = `
  <header>
    <h1 class="h1-style"><img src="images/logo.png" alt="app logo"> BUNKER</h1>
    <i class="fas fa-cog"></i>
    <nav class="menu-nav">
      <div><a href="#/profile-form">Edit profile</a></div>
      <div id='log-out'>Log Out</div>
    </nav>
  </header>
  <main id="main-container">
  <div class="user-info">
    <div class="user-cover-photo-container">
      <div class="user-cover-photo"><img src="" alt="cover photo"></div>
      <img src="images/profile-cube.png" alt="profile photo" class="user-profile-photo pic-style">
    </div>
    <div class="username-bio">
      <h3>User Name</h3>
      <h4>My bio</h4>
    </div>
  </div>
  <section id="lateral-right">
    <div class="post-section">
      <img src="images/profile-cube.png" alt="profile photo" class="pic-style right-size">
      <a href="#/post-section">What's on your mind?</a>
    </div>
    <div id="core-rail">
      <div id="home-posts">
      </div>
    </div>
  </section>
  </main>
  <footer>
    <i class="fas fa-home"></i>
    <i class="fas fa-user"></i>
  </footer>`;
  div.innerHTML = homeView;
  // DISPLAY MENU
  const settingsButton = div.querySelector('.fa-cog');
  const menu = div.querySelector('.menu-nav');
  settingsButton.addEventListener('click', () => {
    menu.classList.toggle('display-flex');
  });
  // LOG OUT
  const logOutButton = div.querySelector('#log-out');
  logOutButton.addEventListener('click', () => {
    logout();
    window.location.hash = '/log-in';
  });
  // Personalize Home
  const user = currentUser();
  if (user !== null) {
    const ProfileName = div.querySelector('.username-bio h3');
    ProfileName.innerHTML = user.displayName;
  }
  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //   }
  // });
  return div;
};
