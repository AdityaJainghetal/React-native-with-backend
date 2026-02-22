import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";

const statsData = [
  { id: "1", title: "Total Users", value: "120" },
  { id: "2", title: "Total Orders", value: "45" },
  { id: "3", title: "Revenue", value: "₹ 1,25,000" },
];

const recentUsers = [
  { id: "1", name: "Aditya", email: "aditya@gmail.com" },
  { id: "2", name: "Rahul", email: "rahul@gmail.com" },
];

const recentOrders = [
  { id: "1", product: "Laptop", amount: "50000" },
  { id: "2", product: "Mobile", amount: "20000" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {statsData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Recent Users */}
      <Text style={styles.sectionTitle}>Recent Users</Text>
      <FlatList
        data={recentUsers}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <Text style={styles.listSubtitle}>{item.email}</Text>
          </View>
        )}
      />

      {/* Recent Orders */}
      <Text style={styles.sectionTitle}>Recent Orders</Text>
      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item.product}</Text>
            <Text style={styles.listSubtitle}>₹ {item.amount}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "30%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#777",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#555",
  },
});
