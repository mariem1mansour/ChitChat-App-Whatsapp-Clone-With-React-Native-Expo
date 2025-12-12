// config/cloudinary.js
// Configuration de Cloudinary pour l'upload d'images

import Constants from "expo-constants";

// Récupération des variables d'environnement
export const CLOUDINARY_CLOUD_NAME =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload une image vers Cloudinary
 * @param {string} uri - L'URI local de l'image à uploader
 * @returns {Promise<string>} - L'URL de l'image uploadée
 */
export const uploadImage = async (uri) => {
  try {
    // Création d'un FormData pour envoyer l'image
    const formData = new FormData();

    // Extraction du nom et du type de fichier depuis l'URI
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    // Ajout de l'image au FormData
    formData.append("file", {
      uri,
      name: filename,
      type,
    });

    // Ajout du upload preset (obligatoire pour l'upload sans signature)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // URL de l'API Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    // Envoi de la requête
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erreur lors de l'upload");
    }

    // Retourne l'URL sécurisée de l'image
    return data.secure_url;
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    throw error;
  }
};
