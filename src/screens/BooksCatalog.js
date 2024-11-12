import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import globalStyles from "../styles/globalStyles";

export default function BooksCatalog({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const booksRef = collection(db, "books");

    const unsubscribe = onSnapshot(booksRef, (snapshot) => {
      const updatedBooks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(updatedBooks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookItem}
            onPress={() =>
              navigation.navigate("BookDetailScreen", { bookId: item.id })
            }
          >
            {item.coverPage ? (
              <Image
                source={{ uri: item.coverPage }}
                style={styles.bookThumbnail}
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            )}

            <View style={styles.details}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.writer}>by {item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 18,
  },
  flatListContainer: {
    paddingBottom: 18,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bookThumbnail: {
    width: 55,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  noImageContainer: {
    width: 55,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#888",
    fontSize: 11,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  writer: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
});
