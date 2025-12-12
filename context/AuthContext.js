// context/AuthContext.js
// Gestion globale de l'authentification dans toute l'application

import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// Provider qui enveloppe toute l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [loading, setLoading] = useState(true); // Chargement initial
  const [userProfile, setUserProfile] = useState(null); // Profil complet de l'utilisateur

  // Écoute les changements d'authentification (connexion/déconnexion)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Récupération du profil utilisateur depuis Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Nettoyage lors du démontage du composant
    return unsubscribe;
  }, []);

  /**
   * Charge le profil utilisateur depuis Firestore
   */
  const loadUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  };

  /**
   * Inscription d'un nouvel utilisateur
   */
  const register = async (email, password, displayName) => {
    try {
      // Création du compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Mise à jour du nom d'affichage
      await updateProfile(user, { displayName });

      // Création du document utilisateur dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: null,
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Connexion d'un utilisateur existant
   */
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Mise à jour du profil utilisateur
   */
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error("Aucun utilisateur connecté");

      // Mise à jour Firebase Auth si displayName ou photoURL change
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL,
        });
      }

      // Mise à jour Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updates);

      // Rechargement du profil
      await loadUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Suppression du compte utilisateur
   */
  const deleteAccount = async () => {
    try {
      if (!user) throw new Error("Aucun utilisateur connecté");

      // Suppression du document Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Suppression du compte Firebase Auth
      await deleteUser(user);
    } catch (error) {
      throw error;
    }
  };

  // Valeurs et fonctions disponibles dans toute l'application
  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    deleteAccount,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
