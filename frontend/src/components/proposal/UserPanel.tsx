import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import colors from "@/src/constants/colors";
import { getImageSource } from "@/src/utils/getImageSource";

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
        style={{ width: 60, height: 60, borderRadius: 100 }}
        resizeMode="cover"
      />
      <Pressable
        style={{
          backgroundColor: colors.brandPrimary,
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 999,
          marginTop: 5,
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
