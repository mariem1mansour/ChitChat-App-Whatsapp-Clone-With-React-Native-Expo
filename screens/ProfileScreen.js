// screens/ProfileScreen.js
// Écran de profil utilisateur

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../config/cloudinary";
import { getInitials, getRandomColor } from "../utils/helpers";

const ProfileScreen = () => {
  const { user, userProfile, updateUserProfile, logout, deleteAccount } =
    useAuth();

  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Sélectionne et upload une photo de profil
   */
  const handlePickImage = async () => {
    try {
      // Demande la permission d'accéder à la galerie
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à vos photos"
        );
        return;
      }

      // Ouvre le sélecteur d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setUploading(true);

        // Upload vers Cloudinary
        const imageUrl = await uploadImage(result.assets[0].uri);

        // Mise à jour du profil
        await updateUserProfile({ photoURL: imageUrl });

        Alert.alert("Succès", "Photo de profil mise à jour !");
      }
    } catch (error) {
      console.error("Erreur upload photo:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la photo");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Sauvegarde les modifications du nom
   */
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({ displayName: displayName.trim() });
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Déconnexion
   */
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erreur", "Impossible de se déconnecter");
          }
        },
      },
    ]);
  };

  /**
   * Suppression du compte
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est irréversible. Toutes vos données seront supprimées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès"
              );
            } catch (error) {
              Alert.alert(
                "Erreur",
                "Impossible de supprimer le compte. Reconnectez-vous et réessayez."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Photo de profil */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
          {uploading ? (
            <View style={styles.avatar}>
              <ActivityIndicator size="large" color="#25D366" />
            </View>
          ) : userProfile?.photoURL ? (
            <Image
              source={{ uri: userProfile.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: getRandomColor(displayName) },
              ]}
            >
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
          <Text style={styles.changePhotoText}>
            {uploading ? "Upload..." : "Changer la photo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informations du profil */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Votre nom"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email}
          editable={false}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Supprimer le compte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111B21",
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#1F2C34",
    borderBottomWidth: 1,
    borderBottomColor: "#2A3942",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#00A884",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  changePhotoText: {
    color: "#00A884",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    color: "#8696A0",
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1F2C34",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#E9EDEF",
    borderWidth: 1,
    borderColor: "#2A3942",
  },
  disabledInput: {
    color: "#8696A0",
    backgroundColor: "#1A2028",
  },
  saveButton: {
    backgroundColor: "#00A884",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: "#1F2C34",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A3942",
  },
  logoutButtonText: {
    color: "#E9EDEF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#2A1A1F",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5C2333",
  },
  deleteButtonText: {
    color: "#F87171",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
