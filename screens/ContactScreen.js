// screens/ContactScreen.js
// Écran de liste des contacts

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useChat } from "../context/ChatContext";
import ContactListItem from "../components/ContactListItem";

const ContactScreen = ({ navigation }) => {
  const { fetchAllUsers, getOrCreateChat } = useChat();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  /**
   * Charge la liste de tous les utilisateurs
   */
  const loadContacts = async () => {
    try {
      setLoading(true);
      const users = await fetchAllUsers();
      setContacts(users);
    } catch (error) {
      console.error("Erreur chargement contacts:", error);
      Alert.alert("Erreur", "Impossible de charger les contacts");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ouvre ou crée une conversation avec un contact
   */
  const handleContactPress = async (contact) => {
    console.log("=== DEBUT handleContactPress ===");
    console.log("Contact reçu:", JSON.stringify(contact, null, 2));

    try {
      console.log("Appel getOrCreateChat...");

      const chatId = await getOrCreateChat(contact.id, {
        uid: contact.id,
        email: contact.email,
        displayName: contact.displayName,
        photoURL: contact.photoURL,
      });

      console.log("ChatId créé:", chatId);
      console.log("Tentative de navigation...");
      console.log("Navigation object:", navigation);

      // Navigation depuis le Tab vers le Stack parent
      const parentNav = navigation.getParent();
      console.log("Parent navigator:", parentNav);

      if (parentNav) {
        parentNav.navigate("ChatRoom", {
          chatId: chatId,
          otherUser: {
            id: contact.id,
            uid: contact.id,
            email: contact.email,
            displayName: contact.displayName,
            photoURL: contact.photoURL,
          },
        });
      } else {
        // Fallback si pas de parent
        navigation.navigate("ChatRoom", {
          chatId: chatId,
          otherUser: {
            id: contact.id,
            uid: contact.id,
            email: contact.email,
            displayName: contact.displayName,
            photoURL: contact.photoURL,
          },
        });
      }

      console.log("Navigation réussie!");
    } catch (error) {
      console.error("=== ERREUR COMPLETE ===");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      Alert.alert(
        "Erreur",
        `Impossible d'ouvrir la conversation: ${error.message}`
      );
    }
  };

  // Affichage si pas de contacts
  if (!loading && contacts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>👥</Text>
        <Text style={styles.emptyTitle}>Aucun contact</Text>
        <Text style={styles.emptySubtitle}>
          Les autres utilisateurs apparaîtront ici
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bouton pour ajouter un contact */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddContact")}
      >
        <Text style={styles.addButtonText}>➕ Ajouter un contact</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onPress={() => handleContactPress(item)}
          />
        )}
        refreshing={loading}
        onRefresh={loadContacts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#25D366",
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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

export default ContactScreen;
