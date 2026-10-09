import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,} from "firebase/auth";
import {app} from "./firebase.js";
import {setToken} from "../../utils/tokenManager.js";

const auth = getAuth(app);

async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setToken(token);
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setToken(token);
    return token;
  } catch (error) {
    throw new Error(error.message);
  } 
}

export { login, signup };
