import { deleteDocument, deleteDocumentIdFromUserCollection, updateDocument, addDocumentIdToUserCollection } from './firestore.js';

export const renderPost = (doc, element) => {
  const post = doc.data();
  const div = document.createElement('div');
  div.className = 'actual-home-post';
  div.setAttribute('data-id', doc.id);
  const template = `
<div class="header-post">
  <img src="images/profile-cube.png" alt="profile photo" class="pic-style right-size">
  <div class="date-username">
    <p class="post-userName"></p>
    <p></p>
    <i></i>
  </div>
</div>
<div class="main-post">
  <p>${post.content}</p>
  <div></div>
</div>
<div class="footer-post">
  <i class="far fa-heart"></i><span class="like-counter">${post.likes}</span>
  <i class="far fa-comments"></i>
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
  firebase.firestore().collection('users').doc(post.userId).get()
    .then((userDoc) => {
      // display name and photo url
      if (userDoc.data().userPhoto !== null || userDoc.data().userPhoto !== '') {
        const photoPost = div.querySelector('.pic-style');
        photoPost.src = userDoc.data().userPhoto;
      }
      postUserName.innerHTML = userDoc.data().userName;
      if (userDoc.data().posts.some((postId) => postId === doc.id)) {
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
          updateDocument('posts', doc.id, ['visibility'], [event.target.value]);
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
          deleteDocumentIdFromUserCollection(post.userId, doc.id, 'posts');
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
          updateDocument('posts', doc.id, ['content'], [postText.innerText]);
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
      // likes
      const likeIcon = div.querySelector('.fa-heart');
      const likeCounterSpan = div.querySelector('.like-counter');
      let likeCounter = post.likes;
      if (userDoc.data().myLikes.some((likedPostId) => likedPostId === doc.id)) {
        likeIcon.classList.add('red');
      }
      likeIcon.addEventListener('click', () => {
        if (likeIcon.classList.contains('red')) {
          likeIcon.classList.remove('red');
          likeCounterSpan.innerHTML = likeCounter--;
          deleteDocumentIdFromUserCollection(post.userId, doc.id, 'myLikes');
        } else {
          likeIcon.classList.add('red');
          likeCounterSpan.innerHTML = likeCounter++;
          addDocumentIdToUserCollection(post.userId, doc.id, 'myLikes');
        }
        updateDocument('posts', doc.id, ['likes'], [likeCounter]);
      });
    });
  element.appendChild(div);
  return div;
};
