// App.js
// Point d'entrée principal de l'application

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

// Import des écrans
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";
import AddContactScreen from "./screens/AddContactScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Navigation pour les utilisateurs NON connectés
 */
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

/**
 * Bottom Tabs pour les écrans principaux
 */
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#25D366",
        tabBarInactiveTintColor: "#666",
        headerStyle: {
          backgroundColor: "#075E54",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="DiscussionsTab"
        component={HomeScreen}
        options={{
          title: "Discussions",
          tabBarLabel: "Discussions",
        }}
      />
      <Tab.Screen
        name="ContactsTab"
        component={ContactScreen}
        options={{
          title: "Contacts",
          tabBarLabel: "Contacts",
        }}
      />
      <Tab.Screen
        name="ProfilTab"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Navigation pour les utilisateurs CONNECTÉS
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#075E54",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          title: "Chat",
        }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
        options={{
          title: "Ajouter un contact",
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Composant de navigation principal
 */
const Navigation = () => {
  const { user, loading } = useAuth();

  // Affiche le SplashScreen pendant le chargement
  if (loading) {
    return <SplashScreen />;
  }

  // Affiche AuthStack si non connecté, AppStack si connecté
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

/**
 * Composant racine de l'application
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProvider>
          <StatusBar style="light" />
          <SafeAreaView edges={["top", "left", "right"]} />
          <Navigation />
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
