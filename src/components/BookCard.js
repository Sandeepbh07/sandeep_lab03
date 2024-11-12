import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BookCard({ name, author }) {
  return (
    <View style={customStyles.container}>
      <Text style={customStyles.title}>{name}</Text>
      <Text style={customStyles.subtitle}>{author}</Text>
    </View>
  );
}

const customStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
});
