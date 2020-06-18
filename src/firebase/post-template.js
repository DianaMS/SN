export const renderPost = (doc, element) => {
  const post = doc.data();
  const div = document.createElement('div');
  div.className = 'actual-home-post';
  div.setAttribute('data-id', doc.id);
  const template = `
<div class="header-post">
  <img src="images/profile-cube.png" alt="profile photo" class="pic-style right-size">
  <div>
    <p class="post-userName"></p>
    <p>${post.timestamp}<i class="fas fa-globe-americas"></i></p>
  </div>
  <i class="fas fa-ellipsis-h"></i>
</div>
<div class="main-post">
  <p>${post.content}</p>
  <div></div>
</div>
<div class="footer-post">
  <i class="far fa-heart"></i>
  <i class="far fa-comments"></i>
</div>`;
  div.innerHTML = template;
  const postUserName = div.querySelector('.post-userName');
  firebase.firestore().collection('users').doc(post.userId).get()
    .then((userDoc) => {
      postUserName.innerHTML = userDoc.data().userName;
    });
  element.appendChild(div);
  return div;
};
