// screens/SplashScreen.js
// Écran de démarrage de l'application

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Logo WhatsApp (emoji comme placeholder) */}
      <Text style={styles.logo}>💬</Text>

      <Text style={styles.title}>ChitChat App</Text>

      {/* Indicateur de chargement */}
      <ActivityIndicator size="large" color="#25D366" style={styles.loader} />

      <Text style={styles.subtitle}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#075E54", // Vert foncé WhatsApp
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
  },
});

export default SplashScreen;
