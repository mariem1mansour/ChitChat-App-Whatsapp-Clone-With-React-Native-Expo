// utils/helpers.js
// Fonctions utilitaires réutilisables

/**
 * Formate un timestamp Firebase en heure lisible (ex: "14:30")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return "";

  // Conversion du timestamp Firebase en Date JavaScript
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

/**
 * Formate une date de manière intelligente
 * - Aujourd'hui: "14:30"
 * - Hier: "Hier"
 * - Cette semaine: "Lundi"
 * - Avant: "12/03/2024"
 */
export const formatMessageDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Même jour
  if (date.toDateString() === today.toDateString()) {
    return formatTime(timestamp);
  }

  // Hier
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }

  // Dans les 7 derniers jours
  const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return days[date.getDay()];
  }

  // Date complète
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Génère une couleur de fond aléatoire pour les avatars sans photo
 */
export const getRandomColor = (str) => {
  const colors = [
    "#075E54", // Vert WhatsApp
    "#128C7E", // Vert clair
    "#25D366", // Vert vif
    "#34B7F1", // Bleu
    "#7B68EE", // Violet
    "#FF6B6B", // Rouge
    "#FFA500", // Orange
    "#20B2AA", // Turquoise
  ];

  // Génère un index basé sur la chaîne de caractères
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Récupère les initiales d'un nom (ex: "Jean Dupont" => "JD")
 */
export const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Valide un email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Tronque un texte long
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
