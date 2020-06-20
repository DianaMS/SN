import { getDocument } from '../firebase/firestore.js';
import { renderMenu } from './menu-publicacion.js';

export const renderComment = (userId, doc, element) => {
  const comment = doc.data();
  const div = document.createElement('div');
  div.setAttribute('data-id', doc.id);
  div.className = 'actual-home-comment';
  const template = `
    <div class="header-comment">
      <img src="images/profile-cube.png" alt="profile photo" class="user-photo-comment pic-style comment-size">
      <div class="date-username">
        <p class="comment-userName"></p>
        <p>dsss</p>
      </div>
    </div>
    <p class="comment-p">${comment.content}</p>`;
  div.innerHTML = template;
  // DISPLAY NAME AND PHOTO URL
  const commentUserName = div.querySelector('.comment-userName');
  getDocument('users', comment.userId, (userDoc) => {
    commentUserName.innerHTML = userDoc.data().userName;
    if (userDoc.data().userPhoto) {
      const photoComment = div.querySelector('.user-photo-comment');
      photoComment.src = userDoc.data().userPhoto;
    }
  });
  // MENU OPTIONS
  if (userId === comment.userId) {
    const headerComment = div.querySelector('.header-comment');
    const postComment = div.querySelector('.comment-p');
    headerComment.appendChild(renderMenu('comments', 'myComments', userId, doc, div, postComment));
  }
  element.appendChild(div);
  return div;
};
