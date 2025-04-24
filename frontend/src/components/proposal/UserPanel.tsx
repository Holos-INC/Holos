import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import colors from "@/src/constants/colors";
import { getImageSource } from "@/src/getImageSource";

interface RequestFormProps {
  username: string;
  image: string;
}

export default function UserPanel({ username, image }: RequestFormProps) {
  const router = useRouter();

  console.log("UserPanel image:", image);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={getImageSource(image || "")}
        style={{ width: 65, height: 65, borderRadius: 100 }}
        resizeMode="cover"
      />
      <Pressable
        style={{
          backgroundColor: colors.brandPrimary,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          marginTop: 15,
        }}
        onPress={() => router.push(`/profile/${username}`)}
      >
        <Text
          style={{
            fontWeight: "500",
            color: "white",
            textAlign: "center",
          }}
        >
          @{username}
        </Text>
      </Pressable>
    </View>
  );
}
