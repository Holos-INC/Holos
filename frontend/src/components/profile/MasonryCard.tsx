import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getImageSource } from "@/src/utils/getImageSource";
import { useRouter } from "expo-router";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { CommissionDTO } from "@/src/constants/CommissionTypes";

type MasonryCardProps = {
  item: WorksDoneDTO | CommissionDTO;
  index: number;
};

const MasonryCard: React.FC<MasonryCardProps> = ({ item, index }) => {
  const router = useRouter();
  const even = index % 2 === 0;
  const [aspectRatio, setAspectRatio] = React.useState(1);

  const imageToUse =
    (item as any).__type === "work" ? item.image : item.newImage;
  const imageSource = getImageSource(imageToUse);

  React.useEffect(() => {
    if (imageSource.uri) {
      Image.getSize(
        imageSource.uri,
        (width, height) => {
          setAspectRatio(width / height);
        },
        () => {
          setAspectRatio(1);
        }
      );
    }
  }, [imageSource.uri]);

  return (
    <TouchableOpacity
      onPress={() => {
        if ((item as any).__type === "work") {
          router.push({
            pathname: "/work/[workId]",
            params: { workId: String(item.id) },
          });
        } else {
          router.push({
            pathname: "/commissions/[commissionId]" as any,
            params: { commissionId: String(item.id) },
          });
        }
      }}
      style={{ padding: 24 }}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: imageSource.uri }}
          style={[styles.image, { aspectRatio }]}
        />
        <View style={styles.bottom}>
          <Text style={styles.title}>{item.name}</Text>
          <Text
            numberOfLines={4}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {item.description}
          </Text>
          <Text style={styles.description}>
            by @
            {"artistSurname" in item ? item.artistSurname : item.artistUsername}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MasonryCard;
const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowRadius: 20,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    borderRadius: 12,
  },
  bottom: {
    paddingHorizontal: 12,
    paddingBlockStart: 6,
    paddingBlockEnd: 20,
  },
  image: {
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 8,
    marginTop: 6,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
