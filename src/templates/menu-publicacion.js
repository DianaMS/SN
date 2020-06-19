import { deleteDocument, deleteDocumentIdFromUserCollection, updateDocument } from '../firebase/firestore.js';

export const renderMenu = (userId, doc, div) => {
  const post = doc.data();
  // MENU OPTIONS
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';
  const menuIcon = document.createElement('i');
  menuIcon.className = 'fas fa-ellipsis-h';
  const menu = document.createElement('div');
  menu.className = 'post-menu';
  menu.classList.add('style-menu');
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  menu.appendChild(editButton);
  menu.appendChild(deleteButton);
  menuContainer.appendChild(menu);
  menuContainer.appendChild(menuIcon);
  menuIcon.addEventListener('click', () => {
    menu.classList.toggle('display-flex');
  });
  // DELETE POST
  deleteButton.addEventListener('click', () => {
    deleteDocument('posts', doc.id);
    deleteDocumentIdFromUserCollection(userId, doc.id, 'myPosts');
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
  return menuContainer;
};
