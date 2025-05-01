declare module "react-native-masonry-list" {
  import { Component, ReactElement } from "react";
  import { ImageStyle, ViewStyle } from "react-native";

  interface MasonryImage {
    uri: string;
    id?: string | number;
    title?: string;
    dimensions?: { width: number; height: number };
    [key: string]: any;
  }

  interface RenderItemParams {
    column: number;
    index: number;
    dimensions: { width: number; height: number };
    masonryDimensions: {
      width: number;
      height: number;
      margin: number;
      gutter: number;
    };
    source: object;
    [key: string]: any;
  }

  interface MasonryListProps {
    images: MasonryImage[];
    spacing?: number;
    columns?: number;
    imageContainerStyle?: ImageStyle;
    rerender?: boolean;
    onPressImage?: (item: MasonryImage, index: number) => void;
    backgroundColor?: string;
    customImageComponent?: React.ComponentType<any>;
    style?: ViewStyle;
    renderIndividualFooter?: (
      item: RenderItemParams,
      index: number
    ) => ReactElement | null;
    [key: string]: any;
  }

  export default class MasonryList extends Component<MasonryListProps> {}
}
