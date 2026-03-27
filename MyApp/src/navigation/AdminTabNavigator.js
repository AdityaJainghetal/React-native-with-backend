

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// import DashboardScreen from "../admin/DashboardScreen";
// import UsersScreen from "../admin/UsersScreen";
// import OrdersScreen from "../admin/OrdersScreen";
// import ProfileScreen from "../admin/ProfileScreen";
// import TaskScreen from "../admin/TaskScreen";

// const Tab = createBottomTabNavigator();

// export default function AdminTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "Home") {
//             iconName = focused ? "home" : "home-outline";
//           } else if (route.name === "Shorts") {
//             iconName = focused ? "people" : "people-outline";
//           } else if (route.name === "Orders") {
//             iconName = focused ? "cart" : "cart-outline";
//           } else if (route.name === "Subscription") {
//             iconName = focused ? "list" : "list-outline";
//           } else if (route.name === "Profile") {
//             iconName = focused ? "person" : "person-outline";
//           }

//           return (
//             <Ionicons name={iconName} size={size} color={color} />
//           );
//         },
//         tabBarActiveTintColor: "blue",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen name="Home" component={DashboardScreen} />
//       <Tab.Screen name="Shorts" component={UsersScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Subscription" component={TaskScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
      
//     </Tab.Navigator>
//   );
// }

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../admin/DashboardScreen";
import UsersScreen from "../admin/UsersScreen";
import OrdersScreen from "../admin/OrdersScreen";
import ProfileScreen from "../admin/ProfileScreen";
import TaskScreen from "../admin/TaskScreen";
import VideoDetail from "../admin/VideoDetailScreen"; // adjust path as needed
import VideoDetailScreen from "../admin/VideoDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Wrap the Tab inside a Stack so VideoDetail is accessible from any tab
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Shorts") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Subscription") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Shorts" component={UsersScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Subscription" component={TaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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