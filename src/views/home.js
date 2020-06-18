import { firstTimeUser, getHomePosts } from '../firebase/firestore.js';

export const home = () => {
  const div = document.createElement('div');
  div.id = 'main-section';
  const homeView = `
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
    </section>`;
  div.innerHTML = homeView;
  // Personalize Home
  const homePosts = div.querySelector('#home-posts');
  getHomePosts(homePosts);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const ProfileName = div.querySelector('.username-bio h3');
      ProfileName.innerHTML = user.displayName;
      firstTimeUser(user.uid, user.displayName, user.photoURL);
    }
  });
  return div;
};
