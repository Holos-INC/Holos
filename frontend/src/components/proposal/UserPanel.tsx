import { BASE_URL } from "@/src/constants/api";
import colors from "@/src/constants/colors";
import { useRouter } from "expo-router";
import { Image, Pressable } from "react-native";
import { Text, View } from "react-native";

interface RequestFormProps {
  username: string;
  image: string;
}

export default function UserPanel({ username, image }: RequestFormProps) {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={image ? { uri: `${BASE_URL}${atob(image)}` } : undefined}
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
        onPress={() =>
          console.log("() => router.push(`/profile/${user.username}`)")
        }
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
