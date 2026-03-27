// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// const initialUsers = [
//   { id: "1", name: "Aditya", email: "aditya@gmail.com" },
//   { id: "2", name: "Rahul", email: "rahul@gmail.com" },
//   { id: "3", name: "Sneha", email: "sneha@gmail.com" },
// ];

// export default function UsersScreen({ navigation }) {
//   const [users, setUsers] = useState(initialUsers);
//   const [search, setSearch] = useState("");

//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const deleteUser = (id) => {
//     Alert.alert("Delete User", "Are you sure?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         onPress: () =>
//           setUsers(users.filter((user) => user.id !== id)),
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Users Management</Text>

//       {/* Search Bar */}
//       <TextInput
//         placeholder="Search user..."
//         value={search}
//         onChangeText={setSearch}
//         style={styles.searchInput}
//       />

//       {/* Add User Button */}
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigation.navigate("AddUser")}
//       >
//         <Text style={styles.addButtonText}>+ Add User</Text>
//       </TouchableOpacity>

//       {/* Users List */}
//       <FlatList
//         data={filteredUsers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.email}>{item.email}</Text>
//             </View>

//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => deleteUser(item.id)}
//             >
//               <Text style={styles.deleteText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   searchInput: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   addButton: {
//     backgroundColor: "#007BFF",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     elevation: 2,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   email: {
//     fontSize: 14,
//     color: "#555",
//   },
//   deleteButton: {
//     backgroundColor: "red",
//     padding: 8,
//     borderRadius: 6,
//   },
//   deleteText: {
//     color: "#fff",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const API_URL = "https://bitzo-server-1.onrender.com/api/users"; // Android emulator

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, {
        name,
        email,
        phone,
        password,
      });
      setEditId(null);
    } else {
      await axios.post(API_URL, {
        name,
        email,
        phone,
        password,
      });
    }

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete User?", "", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await axios.delete(`${API_URL}/${id}`);
          fetchUsers();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User CRUD</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editId ? "Update User" : "Add User"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
              <Text>{item.phone}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEdit(item)}
              >
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={{ color: "#fff" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", textAlign: "center" },
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editBtn: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 6,
    marginRight: 5,
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
  },
});
