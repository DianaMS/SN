import { deleteDocument, deleteDocumentIdFromUserCollection, updateDocument,  getDocument } from '../firebase/firestore.js';

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
  const commentUserName = div.querySelector('.comment-userName');
  const headerComment = div.querySelector('.header-comment');
  getDocument('users', comment.userId, (userDoc) => {
    // display name and photo url
    commentUserName.innerHTML = userDoc.userName;
    if (userDoc.userPhoto) {
      const photoComment = div.querySelector('.user-photo-comment');
      photoComment.src = userDoc.userPhoto;
    }
  });
  if (userId === comment.userId) {
    // MENU OPTIONS
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    const menuIcon = document.createElement('i');
    menuIcon.className = 'fas fa-ellipsis-h';
    const menu = document.createElement('div');
    menu.className = 'comment-menu';
    menu.classList.add('style-menu');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    menu.appendChild(editButton);
    menu.appendChild(deleteButton);
    menuContainer.appendChild(menu);
    menuContainer.appendChild(menuIcon);
    headerComment.appendChild(menuContainer);
    menuIcon.addEventListener('click', () => {
      menu.classList.toggle('display-flex');
    });
    // DELETE POST
    deleteButton.addEventListener('click', () => {
      deleteDocument('comments', doc.id);
      deleteDocumentIdFromUserCollection(userId, doc.id, 'myComments');
      div.parentNode.removeChild(div);
    });
    // EDIT POST
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check';
    const cancelIcon = document.createElement('i');
    cancelIcon.className = 'fas fa-times';
    const postComment = div.querySelector('.comment-p');
    editButton.addEventListener('click', () => {
      postComment.contentEditable = true;
      postComment.focus();
      menu.classList.remove('display-flex');
      menuContainer.innerHTML = '';
      menuContainer.appendChild(checkIcon);
      menuContainer.appendChild(cancelIcon);
    });
    // save changes
    checkIcon.addEventListener('click', () => {
      updateDocument('comments', doc.id, 'content', postComment.innerText);
      postComment.contentEditable = false;
      menuContainer.innerHTML = '';
      menuContainer.appendChild(menu);
      menuContainer.appendChild(menuIcon);
    });
    // cancel changes
    cancelIcon.addEventListener('click', () => {
      postComment.contentEditable = false;
      postComment.textContent = comment.content;
      menuContainer.innerHTML = '';
      menuContainer.appendChild(menu);
      menuContainer.appendChild(menuIcon);
    });
  }
  element.appendChild(div);
  return div;
};
