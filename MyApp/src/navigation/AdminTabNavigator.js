import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../admin/DashboardScreen";
import UsersScreen from "../admin/UsersScreen";
import OrdersScreen from "../admin/OrdersScreen";
import ProfileScreen from "../admin/ProfileScreen";
import TaskScreen from "../admin/TaskScreen";

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="TaskScreen" component={TaskScreen} />
      

    </Tab.Navigator>
  );
}
