import { deleteDocument, deleteDocumentIdFromUserCollection, updateDocument, addDocumentIdToUserCollection, addComment} from './firestore.js';
import { getFileFromStorage } from './storage.js'

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
</div>`;
  div.innerHTML = template;
  // visibility
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
  firebase.firestore().collection('users').doc(post.userId).get()
    .then((userDoc) => {
      postUserName.innerHTML = userDoc.data().userName;
      // display name and photo url
      if (userDoc.data().userPhoto) {
        const photoPost = div.querySelector('.user-photo-post');
        photoPost.src = userDoc.data().userPhoto;
      }
      // paint user likes
      if (userDoc.data().myLikes.some((likedPostId) => likedPostId === doc.id)) {
        likeIcon.classList.add('red');
      }
    });
    // PHOTO
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
      if (userId === post.userId) {
        // visibility chnage options
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
          console.log(event.target.value)
          if (window.location.hash === '#/home' && event.target.value === 'private') {
            div.parentNode.removeChild(div);
          }
        });
        // menu options
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';
        const menuIcon = document.createElement('i');
        menuIcon.className = 'fas fa-ellipsis-h';
        const menu = document.createElement('div');
        menu.className = 'post-menu';
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        menu.appendChild(editButton);
        menu.appendChild(deleteButton);
        menuContainer.appendChild(menu);
        menuContainer.appendChild(menuIcon);
        headerPost.appendChild(menuContainer);
        menuIcon.addEventListener('click', () => {
          menu.classList.toggle('display-flex');
        });
        // DELETE POST
        deleteButton.addEventListener('click', () => {
          deleteDocument('posts', doc.id);
          deleteDocumentIdFromUserCollection(post.userId, doc.id, 'myPosts');
          div.parentNode.removeChild(div);
        });
        // EDIT POST
        const checkIcon = document.createElement('i');
        checkIcon.className = 'fas fa-check';
        const cancelIcon = document.createElement('i');
        cancelIcon.className = 'fas fa-times';
        const postText = div.querySelector('.main-post p');
        editButton.addEventListener('click', () => {
          postText.contentEditable = true;
          postText.focus();
          menu.classList.remove('display-flex');
          menuContainer.innerHTML = '';
          menuContainer.appendChild(checkIcon);
          menuContainer.appendChild(cancelIcon);
        });
        // save changes
        checkIcon.addEventListener('click', () => {
          updateDocument('posts', doc.id, 'content', postText.innerText);
          postText.contentEditable = false;
          menuContainer.innerHTML = '';
          menuContainer.appendChild(menu);
          menuContainer.appendChild(menuIcon);
        });
        // cancel changes
        cancelIcon.addEventListener('click', () => {
          postText.contentEditable = false;
          postText.textContent = post.content;
          menuContainer.innerHTML = '';
          menuContainer.appendChild(menu);
          menuContainer.appendChild(menuIcon);
        });
      }
      //comments
      const actualUserPhoto = div.querySelector('.actual-user-photo');
      firebase.firestore().collection('users').doc(userId).get()
      .then((userDoc) => {
        if (userDoc.data().userPhoto) {
          actualUserPhoto.src = userDoc.data().userPhoto;
        }
      });
      // show form
      const commentIcon = div.querySelector('.fa-comments');
      const commentForm = div.querySelector('.comment-form');
      commentIcon.addEventListener('click', () => {
        commentForm.classList.toggle('display-flex');
      });
      // send comment
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentText = commentForm.querySelector('.comment-text');
        addComment(userId, doc.id, commentText.value);
        addDocumentIdToUserCollection(userId, doc.id, 'myComments');
      });
  element.appendChild(div);
  return div;
};
