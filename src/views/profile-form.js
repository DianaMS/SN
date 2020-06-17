export const profileForm = () => {
  const div = document.createElement('form');
  div.id = 'profile-form';
  const template = `
      <label for="profile-img-selected">Change profile picture</label>
      <input type="file" id="profile-img-selected" name="profile-picture" accept="image/png, image/jpeg">
      <label for="new-username">User name</label>
      <input type="text" id="new-username">
      <label for="bio">Bio</label>
      <input type="text" id="bio">
      <button id="edit-button" class="submit-button-style">POST</button>`;
  div.innerHTML = template;
  return div;
};
