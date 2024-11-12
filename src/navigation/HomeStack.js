import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BooksCatalog from "../screens/BooksCatalog";
import BookDetailScreen from "../screens/BookDetailScreen";

const AppStack = createStackNavigator();

export default function HomeStack() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="BooksCatalog"
        component={BooksCatalog}
        options={{ title: "Available Books" }}
      />
      <AppStack.Screen
        name="BookDetailScreen"
        component={BookDetailScreen}
        options={{ title: "Details" }}
      />
    </AppStack.Navigator>
  );
}
