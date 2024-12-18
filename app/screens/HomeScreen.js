import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShareScreen from './ShareScreen.js'; // Share screen
import InboxScreen from './InboxScreen.js'; // Inbox screen
import ProfileScreen from './ProfileScreen.js'; // Profile screen
import BottomTabIcon from '../components/BottomTabIcon.js'; // Icon component

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (keyboardVisible) return null; // Hide tab bar when keyboard is visible

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            {options.tabBarIcon({ focused: isFocused, color: isFocused ? 'yellow' : 'white', size: 24 })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Share" 
        component={ShareScreen} 
        options={{ tabBarIcon: ({ color }) => <BottomTabIcon name="home" color={color} /> }}
      />
      <Tab.Screen 
        name="Inbox" 
        component={InboxScreen} 
        options={{ tabBarIcon: ({ color }) => <BottomTabIcon name="envelope" color={color} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <BottomTabIcon name="user-alt" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ff009d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { height: -3, width: 0 },
    paddingVertical: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,

  },
});

export default BottomTabNavigator;
