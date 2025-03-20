import { initializeApp } from "firebase/app";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,browserLocalPersistence,setPersistence,signOut }from "firebase/auth";
import {getFirestore,collection,doc,setDoc,getDoc,getDocs,deleteDoc,updateDoc} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBB618EUxX0WeKc_ovEkQqwcRQruJanL14",
  authDomain: "ease-shop-bd843.firebaseapp.com",
  projectId: "ease-shop-bd843",
  storageBucket: "ease-shop-bd843.firebasestorage.app",
  messagingSenderId: "378573011322",
  appId: "1:378573011322:web:3dc43db25ff8836a247ec3",
  measurementId: "G-1HNW8TMZ4M"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence set to local"))
  .catch(error => console.error("Error setting persistence:", error));
export const signUp = async (email, password, fullName, role = "user") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, { fullName, email, role });
    }

    return { user, role };
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error;
  }
};
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() ? userDoc.data().role : null;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        fullName: user.displayName,
        email: user.email,
        role: "user"
      });
    }

    return user;
  } catch (error) {
    console.error("Google Sign-in Error:", error.message);
    throw error;
  }
};
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};
export const getProducts = async () => {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};
export const authStateObserver = (callback) => {
  return onAuthStateChanged(auth, callback);
};
export { 
  auth, 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc 
};
