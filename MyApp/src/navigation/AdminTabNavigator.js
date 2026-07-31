


// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { View, Image, StyleSheet, Platform, Text } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// import DashboardScreen from "../admin/DashboardScreen";
// import ShortsScreen from "../admin/ShortsScreen"; // ← sahi path rakho
// import ProfileScreen from "../admin/ProfileScreen";
// import VideoDetailScreen from "../admin/VideoDetailScreen";

// // Temporary Create Screen
// function CreateScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 20 }}>Create Screen</Text>
//     </View>
//   );
// }

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function TabNavigator() {
//   const insets = useSafeAreaInsets();

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,

//         // ✅ Bottom gap + responsive height fix
//         tabBarStyle: {
//           backgroundColor: "#ffffff",
//           borderTopWidth: 0.5,
//           borderTopColor: "#e0e0e0",
//           height: 56 + insets.bottom,          // safe area ke hisaab se
//           paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
//           paddingTop: 6,
//           elevation: 8,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: -2 },
//           shadowOpacity: 0.08,
//           shadowRadius: 4,
//         },

//         tabBarActiveTintColor: "#000000",
//         tabBarInactiveTintColor: "#606060",
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: "500",
//           marginBottom: Platform.OS === "ios" ? 0 : 4,
//         },

//         tabBarIcon: ({ focused, color }) => {
//           if (route.name === "Home") {
//             return (
//               <Ionicons
//                 name={focused ? "home" : "home-outline"}
//                 size={24}
//                 color={color}
//               />
//             );
//           }

//           if (route.name === "Shorts") {
//             return (
//               <MaterialCommunityIcons
//                 name={focused ? "movie-open-play" : "movie-open-play-outline"}
//                 size={26}
//                 color={color}
//               />
//             );
//           }

//           if (route.name === "Create") {
//             return (
//               <View style={styles.createBtn}>
//                 <Ionicons name="add" size={28} color="#000" />
//               </View>
//             );
//           }

//             if (route.name === "Subscribe") {
//             return (
//               <View style={styles.createBtn}>
//                 <Ionicons name="add" size={28} color="#000" />
//               </View>
//             );
//           }

//           if (route.name === "You") {
//             return (
//               <Image
//                 source={{
//                   uri: "https://i.pravatar.cc/150?img=12", // apni photo yahan daalo
//                 }}
//                 style={[
//                   styles.profileImage,
//                   focused && styles.profileImageActive,
//                 ]}
//               />
//             );
//           }
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={DashboardScreen} />
//       <Tab.Screen name="Shorts" component={ShortsScreen} />
//       <Tab.Screen name="Subscribe" component={ShortsScreen} />

//       <Tab.Screen name="Create" component={CreateScreen} />
//       <Tab.Screen name="You" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function AdminTabNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="MainTabs" component={TabNavigator} />
//       <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
//     </Stack.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   createBtn: {
//     width: 34,
//     height: 34,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//   },
//   profileImageActive: {
//     borderWidth: 1.8,
//     borderColor: "#000",
//   },
// });

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image, StyleSheet, Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import DashboardScreen from "../admin/DashboardScreen";
import ShortsScreen from "../admin/ShortsScreen";
import ProfileScreen from "../admin/ProfileScreen";
import VideoDetailScreen from "../admin/VideoDetailScreen";
import ChannelScreen from "../admin/ChannelScreen"; // Create ke liye

// Temporary Create Screen
function CreateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f0f" }}>
      <Text style={{ fontSize: 20, color: "#fff" }}>Create Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Dark mode tab bar
        tabBarStyle: {
          backgroundColor: "#0f0f0f",
          borderTopWidth: 0.5,
          borderTopColor: "#333",
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },

        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#a1a1aa",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },

        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Home") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            );
          }

          if (route.name === "Shorts") {
            return (
              <MaterialCommunityIcons
                name={focused ? "movie-open-play" : "movie-open-play-outline"}
                size={26}
                color={color}
              />
            );
          }

          if (route.name === "Create") {
            return (
              <View style={styles.createBtn}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            );
          }

          if (route.name === "Subscribe") {
            return (
              <MaterialCommunityIcons
                name={focused ? "youtube-subscription" : "youtube-subscription"}
                size={26}
                color={color}
              />
            );
          }

          if (route.name === "You") {
            return (
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?img=12",
                }}
                style={[
                  styles.profileImage,
                  focused && styles.profileImageActive,
                ]}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Shorts" component={ShortsScreen} />
      <Tab.Screen name="ChannelScreen" component={ChannelScreen} />
      <Tab.Screen name="Subscribe" component={ShortsScreen} />
      <Tab.Screen name="You" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AdminTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  createBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    
    borderRadius: 8,
  },
  profileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  profileImageActive: {
    borderWidth: 1.8,
    borderColor: "#ffffff",
  },
});