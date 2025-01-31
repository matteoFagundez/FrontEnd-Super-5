import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FirebaseAuth } from "./firebase.config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    const { displayName, email, photoURL, uid } = result.user;

    /*  console.log("credentials:", credentials);
    console.log("result.user:", result.user);
    console.log("result completo:", result); */

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error: any) {
    const errorCode = error.code.slice(0, -1);
    const errorMessage = error.message.slice(0, -1);
    return {
      ok: false,
      errorMessage: errorMessage,
    };
  }
};

export const logoutWithGoogle = async () => {
  await signOut(FirebaseAuth);
};
