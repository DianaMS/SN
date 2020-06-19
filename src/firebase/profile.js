const updateUserProfile = (userName) => {
  return firebase.auth().currentUser.updateProfile({
    displayName: userName,
  });
};
export { updateUserProfile };
