// screens/HomeScreen.js
// Écran d'accueil avec la liste des conversations

import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import ChatListItem from "../components/ChatListItem";

const HomeScreen = ({ navigation }) => {
  const { subscribeToChats } = useChat();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Écoute en temps réel des conversations
    const unsubscribe = subscribeToChats((chatsList) => {
      setChats(chatsList);
      setLoading(false);
    });

    // Nettoyage lors du démontage
    return () => unsubscribe();
  }, [user]);

  /**
   * Ouvre une conversation
   */
  const handleChatPress = (chat) => {
    // Récupère les données de l'autre participant
    const otherUserId = chat.participants.find((id) => id !== user.uid);
    const otherUser = chat.participantsData?.[otherUserId];

    if (!otherUser) {
      console.error("Impossible de trouver les données de l'autre utilisateur");
      return;
    }

    navigation.navigate("ChatRoom", {
      chatId: chat.id,
      otherUser: {
        id: otherUserId,
        uid: otherUserId,
        email: otherUser.email,
        displayName: otherUser.displayName,
        photoURL: otherUser.photoURL,
      },
    });
  };

  // Affichage si pas de conversations
  if (!loading && chats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>💬</Text>
        <Text style={styles.emptyTitle}>Aucune conversation</Text>
        <Text style={styles.emptySubtitle}>
          Allez dans l'onglet Contacts pour démarrer une discussion
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem chat={item} onPress={() => handleChatPress(item)} />
        )}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyText: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;
