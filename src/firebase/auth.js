const auth = firebase.auth();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFacebook = new firebase.auth.FacebookAuthProvider();

const currentUser = () => firebase.auth().currentUser;

const registerUserEmail = (email, password) => (
  firebase.auth().createUserWithEmailAndPassword(email, password));

const verificationEmail = () => (firebase.auth().currentUser.sendEmailVerification());

const logIn = (email, password) => (
  firebase.auth().signInWithEmailAndPassword(email, password));

const recoverPassword = (email) => auth.sendPasswordResetEmail(email);

const logInFacebook = () => auth.signInWithPopup(providerFacebook);

const logInGoogle = () => auth.signInWithPopup(providerGoogle);

const logout = () => auth.signOut();

const updateUserProfile = (userName) => {
  return firebase.auth().currentUser.updateProfile({
    displayName: userName,
  });
};

export {
  registerUserEmail, verificationEmail, logIn, recoverPassword, logInFacebook,
  logInGoogle, logout, currentUser, updateUserProfile,
};
