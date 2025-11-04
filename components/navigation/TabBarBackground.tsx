import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const VIEWBOX_WIDTH = 350;
const TAB_BAR_HEIGHT = 60;
const NOTCH_WIDTH = 60;
const NOTCH_DEPTH = 30;
const CENTER = VIEWBOX_WIDTH / 2;
const NOTCH_START_X = CENTER - NOTCH_WIDTH / 2;
const NOTCH_END_X = CENTER + NOTCH_WIDTH / 2;

const path = `
  M 0 0
  L ${NOTCH_START_X} 0
  C ${NOTCH_START_X + 15}, 0, ${CENTER - 15}, ${NOTCH_DEPTH}, ${CENTER}, ${NOTCH_DEPTH}
  C ${CENTER + 15}, ${NOTCH_DEPTH}, ${NOTCH_END_X - 15}, 0, ${NOTCH_END_X}, 0
  L ${VIEWBOX_WIDTH} 0
  L ${VIEWBOX_WIDTH} ${TAB_BAR_HEIGHT}
  L 0 ${TAB_BAR_HEIGHT}
  Z
`;

export default function TabBarBackground() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${TAB_BAR_HEIGHT}`}
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFillObject}
    >
      <Path d={path} fill={Colors.white} />
    </Svg>
  );
}

