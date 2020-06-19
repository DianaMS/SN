import { renderPost } from '../templates/post.js';

const db = firebase.firestore();
const getData = (callback, collectionName) => db.collection(collectionName)
  .onSnapshot((docs) => {
    const data = [];
    docs.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  });
const getDocument = (collectionName, docId, callback) => db.collection(collectionName).doc(docId)
  .get().then((doc) => {
    callback({ id: doc.id, ...doc.data() });
  });
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
const getPosts = (userId, element, query, value) => {
  return db.collection('posts').where(query, '==', value).orderBy('timestamp', 'desc').onSnapshot((postsDocuments) => {
    const changes = postsDocuments.docChanges();
    changes.forEach((change) => {
      if (change.type === 'added') {
        renderPost(userId, change.doc, element);
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
  });
};
const addComment = (userId, postId, content) => {
  return db.collection('comments').add({
    userId,
    postId,
    content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
const updateDocument = (collection, docId, field, value) => {
  return db.collection(collection).doc(docId).update({
    [field]: value,
  });
};
const deleteDocument = (collection, docId) => db.collection(collection).doc(docId).delete();
const deleteDocumentIdFromUserCollection = (userId, docId, field) => {
  return db.collection('users').doc(userId).update({
    [field]: firebase.firestore.FieldValue.arrayRemove(docId),
  });
};
export {
  firstTimeUser, addPost, getPosts, addDocumentIdToUserCollection,
  deleteDocument, deleteDocumentIdFromUserCollection, updateDocument,
  addComment, getData, getDocument,
};
