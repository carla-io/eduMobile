import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const slideAnim = useState(new Animated.Value(-220))[0]; // Start sidebar off-screen

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -220 : 0, // Slide in and out
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("auth-token");
      router.replace("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <View style={styles.topNavbar}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="bars" size={24} color="maroon" style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Icon name="book" size={24} color="maroon" />
          <Text style={styles.title}>EDUTRACKER</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar (Slide-out menu) */}
      <TouchableWithoutFeedback onPress={() => isOpen && toggleMenu()}>
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Dashboard")}>
            <Text style={styles.navLink}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/about")}>
            <Text style={styles.navLink}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/userprofile")}>
            <Text style={styles.navLink}>User Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60, // Explicit height
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "maroon",
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "maroon",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  sidebar: {
    position: "absolute", // Ensure it's positioned absolutely relative to the screen
    top: 60, // Position below the navbar
    left: 0, // Ensure it starts from the left
    width: 220, // Sidebar width
    height: "100%", // Full height
    backgroundColor: "#f5f5f5",
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 100, // Ensure it appears above content
  },
  navItem: {
    paddingVertical: 10,
  },
  navLink: {
    fontSize: 16,
    color: "maroon",
    fontWeight: "bold",
  },
});

export default Navbar;
