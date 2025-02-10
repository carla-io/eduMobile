import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gradeLevel: "",
  });

  const [image, setImage] = useState<string | null>(null);

  const gradeLevels = ["Junior High School", "Senior High School", "College"];

  // Handle text input changes
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Open image picker
  const handleImageChange = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    // Pick an image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.gradeLevel) {
      Toast.show({ type: "error", text1: "All fields are required!" });
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("gradeLevel", formData.gradeLevel);

    if (image) {
      data.append("profilePicture", {
        uri: image,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { token, user } = response.data;
      console.log("Registration successful:", user);

      Toast.show({
        type: "success",
        text1: "Registration Successful!",
      });

      router.push("/Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.response?.data?.message || "Please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Account</Text>
      <Text style={styles.linkText}>
        Already Registered?{" "}
        <Text style={styles.link} onPress={() => router.push("/Login")}>
          Login
        </Text>
      </Text>

      <TextInput
        placeholder="John Doe"
        style={styles.input}
        onChangeText={(text) => handleChange("name", text)}
        value={formData.name}
      />
      <TextInput
        placeholder="hello@example.com"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => handleChange("email", text)}
        value={formData.email}
      />
      <TextInput
        placeholder="********"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
        value={formData.password}
      />
      <TextInput
        placeholder="Enter Grade Level"
        style={styles.input}
        onChangeText={(text) => handleChange("gradeLevel", text)}
        value={formData.gradeLevel}
      />

      {/* Image Upload */}
      <TouchableOpacity onPress={handleImageChange} style={styles.imageUpload}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Toast Notification */}
      <Toast />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7b1111",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 14,
    color: "#7b1111",
    marginBottom: 20,
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#7b1111",
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#7b1111",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageUpload: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: "#7b1111",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imageText: {
    color: "#7b1111",
    textAlign: "center",
  },
});
