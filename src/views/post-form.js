import { addPost, addDocumentIdToUserCollection } from '../firebase/firestore.js';
import { currentUser } from '../firebase/auth.js';

export const postForm = () => {
  const user = currentUser();
  const div = document.createElement('div');
  div.id = 'form-template-container';
  const template = `
  <div>
    <i class="fas fa-arrow-left"></i>
  </div>
  <section id="switch-content">
  <div>
    <img src="images/profile-cube.png" alt="profile photo" class="right-size pic-style">
    <h3>${user.displayName}</h3>
  </div>
  <div id="switch-form">
    <form id="post-form">
    <select name="visibility" id="visibility">
      <option value="public">public</option>
      <option value="private">private</option>
    </select>
      <textarea id="post-content" autofocus>
      </textarea>
      <button id="post-button" class="submit-button-style">POST</button>
    </form>
  </div>
  </section>
  `;
  div.innerHTML = template;
  // GO BACK BUTTON
  const goBackButton = div.querySelector('.fa-arrow-left');
  goBackButton.addEventListener('click', () => {
    window.history.back();
  });
  // MAKE A POST
  const makeAPostForm = div.querySelector('#post-form');
  makeAPostForm.addEventListener('submit', (e) => {
    const content = makeAPostForm['post-content'].value;
    const visibility = makeAPostForm.visibility.value;
    e.preventDefault();
    addPost(user.uid, content, '', visibility).then((doc) => {
      addDocumentIdToUserCollection(user.uid, doc.id, 'posts');
    });
    window.history.back();
  });
  return div;
};
