import { getPosts } from '../firebase/firestore.js';
import { currentUser } from '../firebase/auth.js';

export const profile = () => {
  const div = document.createElement('div');
  div.id = 'profile-posts';
  // Personalize profile
  const user = currentUser();
  getPosts(div, 'userId', user.uid);
  return div;
};
