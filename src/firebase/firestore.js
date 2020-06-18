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
const getPosts = (element, query, value) => {
  return db.collection('posts').where(query, '==', value).orderBy('timestamp', 'desc').onSnapshot((postsDocuments) => {
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

const updateDocument = (collection, docId, arrFields, arrNewValues) => {
  const obj = {};
  arrFields.forEach((field, index) => {
    obj[field] = arrNewValues[index];
  });
  return firebase.firestore().collection(collection).doc(docId).update(obj);
};
const deleteDocument = (collection, docId) => firebase.firestore().collection(collection).doc(docId).delete();
const deleteDocumentIdFromUserCollection = (userId, docId, field) => {
  return firebase.firestore().collection('users').doc(userId).update({
    [field]: firebase.firestore.FieldValue.arrayRemove(docId),
  });
};
export {
  firstTimeUser, addPost, getPosts, addDocumentIdToUserCollection,
  deleteDocument, deleteDocumentIdFromUserCollection, updateDocument,
};
