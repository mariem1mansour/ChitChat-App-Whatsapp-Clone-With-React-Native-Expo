// components/MessageBubble.js
// Composant pour afficher une bulle de message - Design moderne

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { formatTime } from "../utils/helpers";

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {/* Si le message contient une image */}
        {message.imageUrl && (
          <TouchableOpacity activeOpacity={0.9}>
            <Image
              source={{ uri: message.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Si le message contient du texte */}
        {message.text && (
          <Text
            style={[
              styles.text,
              isOwnMessage ? styles.ownText : styles.otherText,
            ]}
          >
            {message.text}
          </Text>
        )}

        {/* Footer avec heure et statut */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              isOwnMessage ? styles.ownTime : styles.otherTime,
            ]}
          >
            {message.timestamp ? formatTime(message.timestamp) : ""}
          </Text>
          {isOwnMessage && <Text style={styles.checkmarks}>✓✓</Text>}
        </View>
      </View>

      {/* Triangle pointer (tail) */}
      <View
        style={[styles.tail, isOwnMessage ? styles.ownTail : styles.otherTail]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  ownMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.5,
    elevation: 2,
  },
  ownBubble: {
    backgroundColor: "#005C4B",
    borderTopRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#1F2C34",
    borderTopLeftRadius: 2,
  },
  text: {
    fontSize: 15.5,
    lineHeight: 20,
    paddingRight: 8,
  },
  ownText: {
    color: "#E9EDEF",
  },
  otherText: {
    color: "#E9EDEF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 11,
  },
  ownTime: {
    color: "#A6BCC4",
  },
  otherTime: {
    color: "#8696A0",
  },
  checkmarks: {
    fontSize: 12,
    color: "#53BDEB",
    marginLeft: 2,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 4,
  },
  // Triangle pointer (tail)
  tail: {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
  ownTail: {
    right: -5,
    bottom: 0,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: "#005C4B",
    borderRightColor: "transparent",
    borderTopColor: "#005C4B",
    borderBottomColor: "transparent",
  },
  otherTail: {
    left: -5,
    bottom: 0,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: "transparent",
    borderRightColor: "#1F2C34",
    borderTopColor: "#1F2C34",
    borderBottomColor: "transparent",
  },
});

export default MessageBubble;
