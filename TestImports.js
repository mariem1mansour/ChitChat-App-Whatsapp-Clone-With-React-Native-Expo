// Fichier de test pour vérifier les imports
// Crée ce fichier temporairement pour tester : TestImports.js

import React from "react";
import { View, Text } from "react-native";

// Import de tous les écrans
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";
import AddContactScreen from "./screens/AddContactScreen";

// Import des composants
import ChatListItem from "./components/ChatListItem";
import ContactListItem from "./components/ContactListItem";
import MessageBubble from "./components/MessageBubble";

const TestImports = () => {
  console.log("=== TEST DES IMPORTS ===");
  console.log("SplashScreen:", typeof SplashScreen);
  console.log("LoginScreen:", typeof LoginScreen);
  console.log("RegisterScreen:", typeof RegisterScreen);
  console.log("HomeScreen:", typeof HomeScreen);
  console.log("ContactScreen:", typeof ContactScreen);
  console.log("ProfileScreen:", typeof ProfileScreen);
  console.log("ChatRoomScreen:", typeof ChatRoomScreen);
  console.log("AddContactScreen:", typeof AddContactScreen);
  console.log("ChatListItem:", typeof ChatListItem);
  console.log("ContactListItem:", typeof ContactListItem);
  console.log("MessageBubble:", typeof MessageBubble);

  // Tous devraient afficher "function"

  return (
    <View>
      <Text>Test des imports - Vérifie la console</Text>
    </View>
  );
};

export default TestImports;
