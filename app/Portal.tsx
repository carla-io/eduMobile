import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, ToastAndroid } from "react-native";
import { useNavigation } from '@react-navigation/native'; // For navigation
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import images
const shsImg = require("./assets/shs.png");
const collegeImg = require ("./assets/college.png");
const careerImg = require ("./assets/career.png");

const Portal = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Retrieve user object from AsyncStorage (localStorage equivalent in React Native)
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setGradeLevel(parsedUser.gradeLevel || "");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  const handlePortalClick = (portalType) => {
    if (portalType === "shs" && (gradeLevel === "Senior High School" || gradeLevel === "College")) {
      ToastAndroid.show("🚫 You cannot access the Senior High School portal.", ToastAndroid.SHORT);
      return;
    }
    if (portalType === "college" && gradeLevel === "College") {
      ToastAndroid.show("🚫 You cannot access the College portal.", ToastAndroid.SHORT);
      return;
    }
    router.push("/Documents"); // Use navigation to go to Documents screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portal</Text>
      <View style={styles.portalGrid}>
        {/* Senior High School Portal */}
        <View style={styles.portal}>
          <Text style={styles.portalHeading}>For Incoming Senior HighSchool</Text>
          <Image source={shsImg} style={styles.portalImage} />
          <Button 
            title="Predict Your Strand"
            onPress={() => handlePortalClick("shs")}
          />
        </View>

        {/* College Portal */}
        <View style={styles.portal}>
          <Text style={styles.portalHeading}>For Incoming College</Text>
          <Image source={collegeImg} style={styles.portalImage} />
          <Button 
            title="Predict Your Course"
            onPress={() => handlePortalClick("college")}
          />
        </View>

        {/* Career Portal (Always Enabled) */}
        <View style={styles.portal}>
          <Text style={styles.portalHeading}>For Your Future Career</Text>
          <Image source={careerImg} style={styles.portalImage} />
          <Button 
            title="Predict Your Career"
            onPress={() => router.push("Documents")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  portalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  portal: {
    width: '45%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  portalImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default Portal;
