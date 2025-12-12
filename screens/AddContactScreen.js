// screens/AddContactScreen.js
// Écran pour ajouter un contact par email

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useChat } from "../context/ChatContext";
import { isValidEmail } from "../utils/helpers";

const AddContactScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { findUserByEmail, getOrCreateChat } = useChat();

  /**
   * Recherche et ajoute un contact
   */
  const handleAddContact = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un email");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }

    try {
      setLoading(true);

      // Recherche l'utilisateur par email
      const user = await findUserByEmail(email.trim());

      if (!user) {
        Alert.alert("Introuvable", "Aucun utilisateur trouvé avec cet email");
        return;
      }

      // Crée ou récupère la conversation
      const chatId = await getOrCreateChat(user.id, {
        uid: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      Alert.alert("Succès", "Contact ajouté !", [
        {
          text: "OK",
          onPress: () => {
            // Navigue vers la conversation
            navigation.navigate("ChatRoom", {
              chatId: chatId,
              otherUser: {
                id: user.id,
                uid: user.id,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur ajout contact:", error);
      Alert.alert("Erreur", "Impossible d'ajouter ce contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajouter un contact</Text>
        <Text style={styles.subtitle}>
          Entrez l'adresse email de la personne que vous souhaitez contacter
        </Text>

        <TextInput
          style={styles.input}
          placeholder="email@exemple.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          autoFocus
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddContact}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Rechercher et ajouter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#075E54",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#25D366",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default AddContactScreen;
