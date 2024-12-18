import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

const BottomTabIcon = ({ name , color}) => {
  return <FontAwesome5 name={name} size={28} color={color} />;
};

export default BottomTabIcon;
