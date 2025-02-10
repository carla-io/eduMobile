import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot, usePathname } from "expo-router";
import Navbar from "../components/Navbar"; // Siguraduhin tama ang path

const Layout = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* Hide Navbar on login screen */}
      

      <View style={styles.content}>
        <Slot /> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
