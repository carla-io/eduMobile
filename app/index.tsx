import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Using Expo's FontAwesome icons
import { useRouter } from "expo-router";
import LoginScreen from "./Login";
const router = useRouter();

export default function Index() {
  const navigation = useNavigation(); // React Native navigation

  const handleStartClick = () => {
    router.push("/Login"); // Navigates to app/login.tsx
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <FontAwesome name="book" size={60} color="maroon" style={styles.icon} />
          <View>
            <Text style={styles.heading}>WELCOME TO</Text>
            <Text style={styles.subheading}>EDUTRACKER</Text>
          </View>
        </View>

        <Text style={styles.tagline}>
          "EduTrack: Your Smart Pathway to Success - Predict, Plan, and Excel!"
        </Text>

        <View style={styles.buttonContainer}>
          <FontAwesome name="user" size={30} color="white" style={styles.userIcon} />
          <TouchableOpacity style={styles.button} onPress={handleStartClick}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.journeyText}>Start Your Journey now!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  content: {
    maxWidth: 700,
    padding: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10, // Adjusted spacing
    marginBottom: 10,
  },
  icon: {
    fontSize: 80,
    color: "maroon",
  },
  heading: {
    fontSize: 30, // Adjusted for mobile screens
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 1,
    color: "maroon",
    textAlign: "center",
  },
  subheading: {
    fontSize: 35,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "maroon",
    textAlign: "left",
  },
  tagline: {
    marginTop: 20,
    fontStyle: "italic",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 25,
    color: "maroon",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15, // Adjusted spacing
  },
  button: {
    width: 200,
    paddingVertical: 14,
    backgroundColor: "#D32F2F",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userIcon: {
    fontSize: 40,
    color: "maroon",
  },
  journeyText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "maroon",
  },
});
