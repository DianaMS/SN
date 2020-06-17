export const renderPosts = (doc) => {
  const div = document.createElement('div');
  div.className = 'actual-home-post';
  const template = `
<div class="header-post">
  <img src="images/profile-cube.png" alt="profile photo" class="pic-style right-size">
  <div>
    <p>${doc.name}</p>
    <p>Date<i class="fas fa-globe-americas"></i></p>
  </div>
  <i class="fas fa-ellipsis-h"></i>
</div>
<div class="main-post">
  <p>${doc.content}</p>
  <div></div>
</div>
<div class="footer-post">
  <i class="far fa-heart"></i>
  <i class="far fa-comments"></i>
</div>`;
  div.innerHTML = template;
  return div;
};
