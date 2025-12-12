// components/ContactListItem.js
// Composant pour afficher un contact dans la liste

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { getInitials, getRandomColor } from "../utils/helpers";

const ContactListItem = ({ contact, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {contact.photoURL ? (
          <Image source={{ uri: contact.photoURL }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: getRandomColor(contact.displayName) },
            ]}
          >
            <Text style={styles.avatarText}>
              {getInitials(contact.displayName)}
            </Text>
          </View>
        )}
      </View>

      {/* Informations */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.displayName}</Text>
        <Text style={styles.email}>{contact.email}</Text>
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: "#666",
  },
});

export default ContactListItem;
