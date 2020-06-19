const storage = firebase.storage();
const addFileToStorage = (refPath, file) => storage.ref(refPath).put(file);
const getFileFromStorage = (path) => {
  return storage.ref().child(path).getDownloadURL().then(url => url);
};
export { addFileToStorage, getFileFromStorage };
