

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   FlatList,
// } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// const Stack = createNativeStackNavigator();


// // ================= LOGIN SCREEN =================
// function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (email === "admin@gmail.com" && password === "1234") {
//       navigation.replace("Dashboard", { userEmail: email });
//     } else {
//       Alert.alert("Invalid Credentials");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


// // ================= DASHBOARD SCREEN =================
// function DashboardScreen({ route, navigation }) {
//   const { userEmail } = route.params;

//   const dummyData = [
//     { id: "1", title: "Total Users", value: "120" },
//     { id: "2", title: "Orders", value: "45" },
//     { id: "3", title: "Revenue", value: "₹ 12,000" },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Dashboard</Text>
//       <Text style={{ marginBottom: 20 }}>Welcome: {userEmail}</Text>

//       <FlatList
//         data={dummyData}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <Text style={styles.cardValue}>{item.value}</Text>
//           </View>
//         )}
//       />

//       <TouchableOpacity
//         style={[styles.button, { marginTop: 20 }]}
//         onPress={() => navigation.replace("Login")}
//       >
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


// // ================= MAIN APP =================
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// // ================= STYLES =================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     marginBottom: 15,
//     borderRadius: 8,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: "#f1f1f1",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   cardValue: {
//     fontSize: 18,
//     marginTop: 5,
//   },
// });


import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return <AppNavigator />;
}
