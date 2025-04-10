import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";
import colors from "@/src/constants/colors";

type Props = {
  isClientTurn: boolean;
};

const TOTAL_DOTS = 9;

export default function TurnDotsIndicator({ isClientTurn }: Props) {
  const [activeIndex, setActiveIndex] = useState(
    isClientTurn ? 0 : TOTAL_DOTS - 1
  );
  const anim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    const newIndex = isClientTurn ? 0 : TOTAL_DOTS - 1;
    setActiveIndex(newIndex);

    Animated.timing(anim, {
      toValue: newIndex,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isClientTurn]);

  return (
    <View style={styles.container}>
      {Array.from({ length: TOTAL_DOTS }).map((_, index) => {
        const isCurrent = index === activeIndex;
        const isPassed = isClientTurn
          ? index <= activeIndex
          : index >= activeIndex;

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isCurrent
                  ? colors.brandPrimary
                  : isPassed
                  ? isClientTurn
                    ? colors.brandPrimary
                    : colors.brandPrimary
                  : "#ffd6dc",
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [1, 2, 1],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    width: "65%",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
