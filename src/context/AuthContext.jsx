import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
 
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        leetcodeUsername: '',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user profile in Firestore:', error);

    }
    
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {

            try {
              await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName || '',
                leetcodeUsername: '',
                createdAt: new Date().toISOString()
              });
              setUserProfile({
                email: user.email,
                displayName: user.displayName || '',
                leetcodeUsername: ''
              });
            } catch (error) {
              console.error('Error creating user profile:', error);
              setUserProfile({
                email: user.email,
                displayName: user.displayName || '',
                leetcodeUsername: ''
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user profile from Firestore:', error);

          setUserProfile({
            email: user.email,
            displayName: user.displayName || '',
            leetcodeUsername: ''
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

