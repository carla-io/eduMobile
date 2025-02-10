import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear auth data if necessary
    // AsyncStorage.removeItem('auth-token'); 

    // Redirect to Login
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
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

      {/* Sidebar */}
      {isOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
            <Text style={styles.navLink}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/about")}>
            <Text style={styles.navLink}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/userprofile")}>
            <Text style={styles.navLink}>User Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "transparent",
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
    padding: 10,
    backgroundColor: "maroon",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 60,
    width: 200,
    height: "100%",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  navLink: {
    fontSize: 16,
    color: "maroon",
    paddingVertical: 10,
  },
});

export default Navbar;
