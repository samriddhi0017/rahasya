import firebase from 'firebase/app';
import 'firebase/auth';

const AuthService = {
  async login(email, password) {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  },
  async logout() {
    await firebase.auth().signOut();
  },
};

export default AuthService;
