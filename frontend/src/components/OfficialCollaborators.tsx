import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { mobileStyles as styles } from "@/src/styles/Explore.styles";

type Collaborator = {
  name: string;
  role: string;
  description: string;
  image: string;
  url: string;
};

const collaborators: Collaborator[] = [
  {
    name: "VYA Art Gallery",
    role: "Aliado oficial de Holos",
    description: "Obras de arte exclusivas para espacios únicos",
    image:
      "https://vya-artgallery.com/wp-content/uploads/2023/07/cropped-logo-WEB-sin-fondo-2048x2048.png",
    url: "https://vya-artgallery.com/",
  },
];

function CollaboratorImage({ uri, name }: { uri: string; name: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <View style={[styles.collabImage, styles.collabFallback]}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 12 }}>
          icon
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.collabImage}
      onError={() => setError(true)}
    />
  );
}

export default function OfficialCollaborators() {
  return (
    <View style={[styles.bottomSection, { paddingHorizontal: 24 }]}>
      <View style={styles.bottomSectionHeader}>
        <Text style={styles.bottomSectionHeaderText}>
          COLABORADORES OFICIALES
        </Text>
      </View>

      {collaborators.map((collab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.collabCard}
          onPress={() => Linking.openURL(collab.url)}
        >
          <CollaboratorImage uri={collab.image} name={collab.name} />
          <View style={styles.collabTextContainer}>
            <Text style={styles.collabName}>{collab.name}</Text>
            <Text style={styles.collabRole}>{collab.role}</Text>
            <Text style={styles.collabDescription}>{collab.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
