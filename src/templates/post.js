import { deleteDocumentIdFromUserCollection, updateDocument, addDocumentIdToUserCollection, addComment, getDocument } from '../firebase/firestore.js';
import { getFileFromStorage } from '../firebase/storage.js';
import { renderComment } from './comment.js';
import { renderMenu } from './menu-publicacion.js';

export const renderPost = (userId, doc, element) => {
  const post = doc.data();
  const div = document.createElement('div');
  div.setAttribute('data-id', doc.id);
  div.className = 'actual-home-post';
  const template = `
<div class="header-post">
  <img src="images/profile-cube.png" alt="profile photo" class="user-photo-post pic-style right-size">
  <div class="date-username">
    <p class="post-userName"></p>
    <p></p>
    <i></i>
  </div>
</div>
<div class="main-post">
  <p>${post.content}</p>
</div>
<div class="footer-post">
  <i class="far fa-heart"></i><span class="like-counter">${post.likes}</span>
  <i class="far fa-comments"></i><span class="comments-counter"></span>
  <form class="comment-form">
      <img src="images/profile-cube.png" alt="profile photo" class="actual-user-photo pic-style comment-size">
      <input class="comment-text" type="text" required>
      <button><i class="fa fa-paper-plane"></i></button>
  </form>
  <div class="comment-container"></div>
</div>`;
  div.innerHTML = template;
  // VISIBILITY ICON
  const visibilityIcon = div.querySelector('.header-post i');
  if (post.visibility === 'public') {
    visibilityIcon.className = 'fas fa-globe-americas';
  } else {
    visibilityIcon.className = 'fas fa-lock';
  }
  const postUserName = div.querySelector('.post-userName');
  const headerPost = div.querySelector('.header-post');
  const dateUsername = div.querySelector('.date-username');
  const likeIcon = div.querySelector('.fa-heart');
  // DISPALY NAME AND PHOTO URL
  getDocument('users', post.userId, (userDoc) => {
    postUserName.innerHTML = userDoc.userName;
    if (userDoc.userPhoto) {
      const photoPost = div.querySelector('.user-photo-post');
      photoPost.src = userDoc.userPhoto;
    }
  });
  // PHOTO POST
  const mainPost = div.querySelector('.main-post');
  if (post.photo !== '') {
    const img = document.createElement('img');
    img.className = 'photo-post';
    img.alt = 'photo';
    getFileFromStorage(post.photo).then((url) => {
      img.src = url;
    });
    mainPost.appendChild(img);
  }
  if (userId === post.userId) {
    // VISIBILITY CHANGE OPTIONS
    const visibilitySelect = document.createElement('select');
    const publicOption = document.createElement('option');
    const privateOption = document.createElement('option');
    publicOption.innerHTML = 'public';
    privateOption.innerHTML = 'private';
    if (post.visibility === 'private') {
      visibilitySelect.appendChild(privateOption);
      visibilitySelect.appendChild(publicOption);
    } else {
      visibilitySelect.appendChild(publicOption);
      visibilitySelect.appendChild(privateOption);
    }
    dateUsername.replaceChild(visibilitySelect, visibilityIcon);
    visibilitySelect.addEventListener('change', (event) => {
      updateDocument('posts', doc.id, 'visibility', event.target.value);
      if (window.location.hash === '#/home' && event.target.value === 'private') {
        div.parentNode.removeChild(div);
      }
    });
    // DISPLAY MENU
    headerPost.appendChild(renderMenu(userId, doc, div));
  }
  // COMMENT FORM PHOTO
  const actualUserPhoto = div.querySelector('.actual-user-photo');
  getDocument('users', userId, (currentUserDoc) => {
    if (currentUserDoc.userPhoto) {
      actualUserPhoto.src = currentUserDoc.userPhoto;
    }
    // PAINT USER LIKES
    if (currentUserDoc.myLikes.some((likedPostId) => likedPostId === doc.id)) {
      likeIcon.classList.add('red');
    }
  });
  // likes
  const likeCounterSpan = div.querySelector('.like-counter');
  let likeCounter = post.likes;
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('red');
    if (likeIcon.classList.contains('red')) {
      likeCounter++;
      addDocumentIdToUserCollection(userId, doc.id, 'myLikes');
    } else {
      likeCounter--;
      deleteDocumentIdFromUserCollection(userId, doc.id, 'myLikes');
    }
    likeCounterSpan.innerHTML = likeCounter;
    updateDocument('posts', doc.id, 'likes', likeCounter);
  });
  // SHOW COMMENT FORM
  const commentIcon = div.querySelector('.fa-comments');
  const commentForm = div.querySelector('.comment-form');
  const commentContainer = div.querySelector('.comment-container');
  commentIcon.addEventListener('click', () => {
    commentForm.classList.toggle('display-flex');
    commentContainer.classList.toggle('display-flex');
  });
  // SEND COMMENT
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentText = commentForm.querySelector('.comment-text');
    addComment(userId, doc.id, commentText.value).then((comment) => {
      addDocumentIdToUserCollection(userId, comment.id, 'myComments');
      getDocument('comments', comment.id, (commentDoc) => {
        console.log(commentDoc);
      });
      commentForm.reset();
    });
  });
  // SHOW POST COMMENTS
  firebase.firestore().collection('comments').where('postId', '==', doc.id).orderBy('timestamp', 'desc')
    .get()
    .then((comments) => {
      comments.docs.forEach((comment) => {
        renderComment(userId, comment, commentContainer);
      });
    });
  element.appendChild(div);
  return div;
};
