import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import styles from "../styles/globalStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://10.0.2.2:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Login Successful");

        navigation.replace("AdminPanel", {
          userEmail: data.user.email,
        });
      } else {
        Alert.alert(data.message || "Invalid Credentials");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}
