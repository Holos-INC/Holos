import React from "react";
import { View, useWindowDimensions } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import MasonryCard from "./MasonryCard";
import { CommissionDTO } from "@/src/constants/CommissionTypes";

interface MasonryGalleryProps {
  works: WorksDoneDTO[] | CommissionDTO[];
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({ works }) => {
  const { width } = useWindowDimensions();

  const getNumColumns = () => {
    if (width > 1000) return 4;
    if (width > 700) return 3;
    return 2;
  };

  return (
    <View>
      <MasonryList
        data={works}
        numColumns={getNumColumns()}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item, i }) => (
          <MasonryCard item={item as WorksDoneDTO | CommissionDTO} index={i} />
        )}
      />
    </View>
  );
};
