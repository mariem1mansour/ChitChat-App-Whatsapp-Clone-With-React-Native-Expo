// components/ChatListItem.js
// Composant pour afficher une conversation dans la liste (HomeScreen)

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  formatMessageDate,
  getInitials,
  getRandomColor,
  truncateText,
} from "../utils/helpers";

const ChatListItem = ({ chat, onPress }) => {
  const { user } = useAuth();

  // Récupère les données de l'autre participant
  const otherUserId = chat.participants.find((id) => id !== user.uid);
  const otherUser = chat.participantsData?.[otherUserId];

  if (!otherUser) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {otherUser.photoURL ? (
          <Image source={{ uri: otherUser.photoURL }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: getRandomColor(otherUser.displayName) },
            ]}
          >
            <Text style={styles.avatarText}>
              {getInitials(otherUser.displayName)}
            </Text>
          </View>
        )}
      </View>

      {/* Informations */}
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{otherUser.displayName}</Text>
          <Text style={styles.time}>
            {chat.lastMessageTime
              ? formatMessageDate(chat.lastMessageTime)
              : ""}
          </Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {truncateText(chat.lastMessage || "Aucun message", 40)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChatListItem;
