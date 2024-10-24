import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";

import { useUserContext } from "../contexts/UserContext";
import NotificationCard from "../components/NotificationCard";

function NotifyScreen() {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState([]);

  const firestore = getFirestore();
  const notificationsCollection = collection(firestore, "notifications");

  // notifications 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(
      notificationsCollection,
      orderBy("createdAt", "desc"),
      where("receiverId", "==", user.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifications);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const renderItem = ({ item }) => (
  <NotificationCard
    createdAt={item.createdAt}
    message={item.message}
    id={item.id}
    senderId={item.senderId}
    receiverId={item.receiverId}
    data={item.data}
    clicked={item.clicked}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
});

export default NotifyScreen;
