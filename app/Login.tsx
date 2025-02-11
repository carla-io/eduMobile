import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { FontAwesome5 } from "@expo/vector-icons";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://192.168.100.171:4000/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, user } = response.data;

      // Store auth data
      await AsyncStorage.setItem("auth-token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        position: "top",
      });

      // Navigate to home screen
      router.push("/Dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed! Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Login Card */}
      <View style={styles.loginCard}>
        <Text style={styles.heading}>LOGIN</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.registerLink}>
          New to this site?{" "}
          <Text style={styles.registerText} onPress={() => router.push("/Register")}>
            Register
          </Text>
        </Text>
      </View>

      {/* Address Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome5 name="address-card" size={100} color="maroon" />
      </View>

      {/* Toast Notification */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loginCard: {
    backgroundColor: "#7b1111",
    padding: 24,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    color: "white",
    marginBottom: 16,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#7b1111",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    color: "white",
    marginTop: 20,
  },
  registerText: {
    textDecorationLine: "underline",
  },
  iconContainer: {
    marginTop: 20,
  },
});

export default Login;
