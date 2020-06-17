const getData = (callback, collectionName) => firebase.firestore().collection(collectionName)
  .onSnapshot((docs) => {
    const data = [];
    docs.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  });
const addPost = (content, likes, visibility, date, photo, userPhoto, userName) => firebase.firestore().collection('posts').add({
  content,
  likes,
  visibility,
  date,
  photo,
  userPhoto,
  userName,
});
const addComment = (postId, content, likes, date, userPhoto, userName, uid) => firebase.firestore().collection('comments').add({
  postId,
  content,
  likes,
  date,
  userPhoto,
  userName,
  uid,
});
const addDocumentIdToUserCollection = (userId, docId, field) => {
  return firebase.firestore().collection('users').doc(userId).update({
    [field]: firebase.firestore.FieldValue.arrayUnion(docId),
  });
};
const updateDocument = (collection, docId, arrFields, arrNewValues) => {
  const obj = {};
  arrFields.forEach((field, index) => {
    obj[field] = arrNewValues[index];
  });
  return firebase.firestore().collection(collection).doc(docId).update(obj);
};
const deletingDocument = (collection, docId) => firebase.firestore().collection(collection).doc(docId).delete();
const deletingDocumentFromUser = (userId, postId, field) => {
  return firebase.firestore().collection('users').doc(userId).update({
    [field]: firebase.firestore.FieldValue.arrayRemove(postId),
  });
};
const updateUserDataOnPosts = (collection, userId, property, newValue) => {
  return firebase.firestore().collection('users').doc(userId).get()
    .then((docId) => {
      const ids = docId.data()[collection];
      return firebase.firestore().collection(collection).get().then((documents) => {
        documents.docs.forEach((doc) => {
          if (ids.some((id) => id === doc.id)) {
            firebase.firestore().collection(collection).doc(doc.id).update({
              [property]: newValue,
            });
          }
        });
      });
    });
};
export {
  getData, addPost, addComment, addDocumentIdToUserCollection,
  deletingDocument, deletingDocumentFromUser,
  updateUserDataOnPosts, updateDocument,
};
