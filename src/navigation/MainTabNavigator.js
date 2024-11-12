import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import BorrowedBooks from "../screens/BorrowedBooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BottomTab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="BorrowedBooks"
        component={BorrowedBooks}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
