import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import globalStyles from "../styles/globalStyles";

export default function BookDetailScreen({ route }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);

  const loadBookDetails = async () => {
    try {
      const ref = doc(db, "books", bookId);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setBook({ id: snapshot.id, ...snapshot.data() });
      } else {
        Alert.alert("Error", "Unable to locate book details.");
      }
    } catch (error) {
      console.error("Error loading book:", error);
    }
  };

  useEffect(
    useCallback(() => {
      loadBookDetails();
    }, [bookId])
  );

  const borrowBook = async () => {
    try {
      const borrowedRef = collection(db, "borrowedBooks");
      const borrowedBooks = await getDocs(borrowedRef);

      if (borrowedBooks.size >= 3) {
        Alert.alert("Limit Reached", "You may borrow up to 3 books only.");
        return;
      }

      await addDoc(borrowedRef, {
        id: book.id,
        title: book.name,
        writer: book.author,
        coverImage: book.coverPage,
        stars: book.rating,
        description: book.summary,
        borrowedDate: new Date(),
      });

      const bookRef = doc(db, "books", book.id);
      await updateDoc(bookRef, { isBorrowed: true });

      setBook((prev) => ({ ...prev, isBorrowed: true }));

      Alert.alert("Success", "Book successfully borrowed!");
    } catch (error) {
      console.error("Borrowing error:", error);
      Alert.alert("Error", "An issue occurred while borrowing.");
    }
  };

  if (!book) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading book information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.coverPage }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.writer}>by {book.author}</Text>
        <Text style={styles.stars}>Rating: {book.rating}</Text>

        <Text style={styles.section}>Summary</Text>
        <Text style={styles.description}>{book.summary}</Text>

        <Text
          style={[
            styles.availability,
            { color: book.isBorrowed ? "tomato" : "green" },
          ]}
        >
          {book.isBorrowed ? "Currently Unavailable" : "Available"}
        </Text>

        {!book.isBorrowed && (
          <TouchableOpacity style={styles.borrow} onPress={borrowBook}>
            <Text style={styles.borrowText}>Borrow Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  image: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  details: {
    padding: 18,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  writer: {
    fontSize: 17,
    color: "#777",
    textAlign: "center",
    marginBottom: 12,
  },
  stars: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginBottom: 12,
  },
  section: {
    fontSize: 19,
    fontWeight: "600",
    color: "#333",
    marginTop: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    textAlign: "justify",
  },
  availability: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 18,
  },
  borrow: {
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: "#0084FF",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 18,
  },
  borrowText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
