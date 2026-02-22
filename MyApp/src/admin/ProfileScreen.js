import React from "react";
import { View, Text } from "react-native";
import CustomButton from "../components/CustomButton";
import styles from "../styles/globalStyles";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>
      <Text>Email: admin@gmail.com</Text>

      <CustomButton
        title="Logout"
        onPress={() => navigation.replace("Login")}
      />
    </View>
  );
}
