import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const borrowedRef = collection(db, "borrowedBooks");
    const unsubscribe = onSnapshot(borrowedRef, (snapshot) => {
      const updatedBooks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBorrowedBooks(updatedBooks);
    });

    return () => unsubscribe();
  }, []);

  const returnBook = async (bookId) => {
    try {
      const borrowedRef = collection(db, "borrowedBooks");
      const queryRef = query(borrowedRef, where("id", "==", bookId));
      const snapshot = await getDocs(queryRef);

      if (snapshot.empty) {
        return;
      }

      const borrowedBookId = snapshot.docs[0].id;
      await deleteDoc(doc(db, "borrowedBooks", borrowedBookId));

      const bookDoc = doc(db, "books", bookId);
      await updateDoc(bookDoc, { isBorrowed: false });

    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <View style={styles.container}>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooksText}>
          No books currently borrowed.
        </Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.authorText}>by {item.writer}</Text>
              </View>
              <TouchableOpacity
                style={styles.returnBtn}
                onPress={() => returnBook(item.id)}
              >
                <Text style={styles.returnBtnText}>Return</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  noBooksText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 18,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  authorText: {
    fontSize: 14,
    color: "#555",
  },
  returnBtn: {
    backgroundColor: "#FF4500",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  returnBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
