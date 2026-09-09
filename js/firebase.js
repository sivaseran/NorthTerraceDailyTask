import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc, query, where, onSnapshot, serverTimestamp, writeBatch } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig); export const db=getFirestore(app);
export {collection,doc,getDocs,setDoc,updateDoc,query,where,onSnapshot,serverTimestamp,writeBatch};
