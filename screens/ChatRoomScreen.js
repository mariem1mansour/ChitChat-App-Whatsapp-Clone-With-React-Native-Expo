// screens/ChatRoomScreen.js
// Écran de conversation (chat room) - Design amélioré

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../config/cloudinary";
import MessageBubble from "../components/MessageBubble";

const ChatRoomScreen = ({ route, navigation }) => {
  const { chatId, otherUser } = route.params || {};
  const { sendMessage, subscribeToMessages } = useChat();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const flatListRef = useRef(null);

  // Définit le titre de l'écran
  useEffect(() => {
    if (otherUser?.displayName) {
      navigation.setOptions({
        title: otherUser.displayName,
      });
    }
  }, [otherUser, navigation]);

  useEffect(() => {
    if (!chatId) {
      Alert.alert("Erreur", "ID de conversation manquant");
      navigation.goBack();
      return;
    }

    // Écoute les messages en temps réel
    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  /**
   * Envoie un message texte
   */
  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text) return;

    try {
      setSending(true);
      setMessageText("");
      await sendMessage(chatId, { text });
    } catch (error) {
      console.error("Erreur envoi message:", error);
      Alert.alert("Erreur", "Impossible d'envoyer le message");
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  /**
   * Sélectionne et envoie une image
   */
  const handleSendImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission refusée", "Vous devez autoriser l'accès à vos photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setUploading(true);
        const imageUrl = await uploadImage(result.assets[0].uri);
        await sendMessage(chatId, { imageUrl });
      }
    } catch (error) {
      console.error("Erreur envoi image:", error);
      Alert.alert("Erreur", "Impossible d'envoyer l'image");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Affichage quand il n'y a pas de messages
   */
  const EmptyChat = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>💬</Text>
      </View>
      <Text style={styles.emptyTitle}>Aucun message</Text>
      <Text style={styles.emptySubtitle}>
        Envoyez un message pour démarrer la conversation
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Liste des messages avec pattern de fond WhatsApp */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwnMessage={item.senderId === user.uid}
            />
          )}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.messagesListEmpty,
          ]}
          ListEmptyComponent={<EmptyChat />}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Indicateur d'upload avec animation */}
      {uploading && (
        <View style={styles.uploadingContainer}>
          <View style={styles.uploadingBubble}>
            <ActivityIndicator color="#25D366" size="small" />
            <Text style={styles.uploadingText}>Envoi en cours...</Text>
          </View>
        </View>
      )}

      {/* Barre d'envoi de message redessinée */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {/* Bouton image avec style amélioré */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleSendImage}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <Text style={styles.imageButtonText}>📎</Text>
          </TouchableOpacity>

          {/* Champ de texte amélioré */}
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#888"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />

          {/* Bouton d'envoi conditionnel */}
          {messageText.trim().length > 0 ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={sending}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>➤</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.micButton}
              activeOpacity={0.7}
            >
              <Text style={styles.micButtonText}>🎤</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1014", // Fond sombre pour contraste
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#0D1418", // Fond légèrement plus clair
  },
  messagesList: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C2830",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E9EDEF",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8696A0",
    textAlign: "center",
    lineHeight: 20,
  },
  uploadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2830",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  uploadingText: {
    color: "#E9EDEF",
    fontSize: 14,
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: "#1C2830",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A3942",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#2A3942",
    borderRadius: 25,
    paddingLeft: 8,
  },
  imageButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  imageButtonText: {
    fontSize: 22,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#E9EDEF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    minHeight: 36,
  },
  sendButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00A884",
    borderRadius: 21,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  micButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    marginBottom: 2,
  },
  micButtonText: {
    fontSize: 24,
  },
});

export default ChatRoomScreen;