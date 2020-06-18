import { renderPost } from './post-template.js';

const db = firebase.firestore();
// const getData = (callback, collectionName) => db.collection(collectionName)
//   .onSnapshot((docs) => {
//     const data = [];
//     docs.forEach((doc) => {
//       data.push({ id: doc.id, ...doc.data() });
//     });
//     callback(data);
//   });
const firstTimeUser = (userId, displayName, profilePhoto) => {
  db.collection('users').doc(userId).get().then((doc) => {
    if (!doc.exists) {
      db.collection('users').doc(userId).set({
        userName: displayName,
        userPhoto: profilePhoto,
        coverPhoto: '',
        bio: '',
        myLikes: [],
        myPosts: [],
        myComments: [],
      });
    }
  });
};
const getHomePosts = (element) => {
  return db.collection('posts').where('visibility', '==', 'public').orderBy('timestamp', 'desc').onSnapshot((postsDocuments) => {
    const changes = postsDocuments.docChanges();
    changes.forEach((change) => {
      if (change.type === 'added') {
        renderPost(change.doc, element);
      } else if (change.type === 'removed') {
        const li = document.querySelector(`[data-id=${change.doc.id}]`);
        element.removeChild(li);
      }
    });
  });
};
const addDocumentIdToUserCollection = (userId, docId, field) => {
  return db.collection('users').doc(userId).update({
    [field]: firebase.firestore.FieldValue.arrayUnion(docId),
  });
};
const addPost = (userId, content, photo, visibility) => {
  return db.collection('posts').add({
    userId,
    content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    photo,
    visibility,
    likes: 0,
    comments: [],
  });
};
export {
  firstTimeUser, addPost, getHomePosts, addDocumentIdToUserCollection,
};
