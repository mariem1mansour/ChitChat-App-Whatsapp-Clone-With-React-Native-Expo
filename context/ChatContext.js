// context/ChatContext.js
// Gestion globale des conversations et messages

import React, { createContext, useContext, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat doit être utilisé dans un ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]); // Liste des conversations
  const [contacts, setContacts] = useState([]); // Liste des contacts

  /**
   * Génère un ID unique pour une conversation entre deux utilisateurs
   * L'ordre est alphabétique pour garantir le même ID peu importe qui initie
   */
  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  /**
   * Récupère ou crée une conversation avec un utilisateur
   */
  const getOrCreateChat = async (otherUserId, otherUserData) => {
    try {
      if (!user) throw new Error("Utilisateur non connecté");

      const chatId = getChatId(user.uid, otherUserId);
      const chatRef = doc(db, "chats", chatId);

      // Création du document de conversation s'il n'existe pas
      await setDoc(
        chatRef,
        {
          participants: [user.uid, otherUserId],
          participantsData: {
            [user.uid]: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [otherUserId]: otherUserData,
          },
          lastMessage: null,
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ); // merge: true évite d'écraser si existe déjà

      return chatId;
    } catch (error) {
      console.error("Erreur création chat:", error);
      throw error;
    }
  };

  /**
   * Envoie un message dans une conversation
   */
  const sendMessage = async (chatId, messageData) => {
    try {
      if (!user) throw new Error("Utilisateur non connecté");

      // Ajout du message dans la sous-collection 'messages'
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        text: messageData.text || null,
        imageUrl: messageData.imageUrl || null,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Mise à jour du dernier message dans le document chat
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        lastMessage: messageData.text || "📷 Photo",
        lastMessageTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur envoi message:", error);
      throw error;
    }
  };

  /**
   * Écoute les messages d'une conversation en temps réel
   */
  const subscribeToMessages = (chatId, callback) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    // onSnapshot retourne une fonction de désabonnement
    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  };

  /**
   * Écoute les conversations de l'utilisateur connecté
   */
  const subscribeToChats = (callback) => {
    if (!user) return () => {};

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTime", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const chatsList = [];
      snapshot.forEach((doc) => {
        chatsList.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatsList);
      callback(chatsList);
    });
  };

  /**
   * Récupère tous les utilisateurs inscrits (pour la liste de contacts)
   */
  const fetchAllUsers = async () => {
    try {
      if (!user) return [];

      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const snapshot = await getDocs(q);

      const users = [];
      snapshot.forEach((doc) => {
        // Ne pas inclure l'utilisateur connecté
        if (doc.id !== user.uid) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });

      setContacts(users);
      return users;
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
      throw error;
    }
  };

  /**
   * Recherche un utilisateur par email
   */
  const findUserByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email.toLowerCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error("Erreur recherche utilisateur:", error);
      throw error;
    }
  };

  const value = {
    chats,
    contacts,
    getChatId,
    getOrCreateChat,
    sendMessage,
    subscribeToMessages,
    subscribeToChats,
    fetchAllUsers,
    findUserByEmail,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
