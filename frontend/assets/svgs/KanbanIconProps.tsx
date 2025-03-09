import React from "react";
import Svg, { Path } from "react-native-svg";

type KanbanIconProps = {
  width?: number;
  height?: number;
  stroke?: string;
};

const KanbanIcon: React.FC<KanbanIconProps> = ({
  width = 24,
  height = 24,
  stroke = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 52 52">
      <Path d="M32,17.5c0-0.8-0.7-1.5-1.5-1.5h-9c-0.8,0-1.5,0.7-1.5,1.5v27c0,0.8,0.7,1.5,1.5,1.5h9 c0.8,0,1.5-0.7,1.5-1.5V17.5z" />
      <Path d="M14,17.5c0-0.8-0.7-1.5-1.5-1.5h-9C2.7,16,2,16.7,2,17.5v31C2,49.3,2.7,50,3.5,50h9c0.8,0,1.5-0.7,1.5-1.5 V17.5z" />
      <Path d="M50,17.5c0-0.8-0.7-1.5-1.5-1.5h-9c-0.8,0-1.5,0.7-1.5,1.5v23c0,0.8,0.7,1.5,1.5,1.5h9 c0.8,0,1.5-0.7,1.5-1.5V17.5z" />
      <Path d="M50,3.5C50,2.7,49.3,2,48.5,2h-45C2.7,2,2,2.7,2,3.5v5C2,9.3,2.7,10,3.5,10h45c0.8,0,1.5-0.7,1.5-1.5V3.5z" />
    </Svg>
  );
};

export default KanbanIcon;
