import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, View, FlatList } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { getNotifications } from "../lib/notifications";
import NotificationCard from "../components/NotificationCard";

function NotifyScreen() {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications(user.id).then(setNotifications);
  }, []);

  return (
    <View style={styles.block}>
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
    userId={item.receiverId}
    data={item.data}
  />
);

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
});

export default NotifyScreen;
