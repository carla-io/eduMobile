import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const handleStartClick = () => {
    router.push("/Login")
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <FontAwesome5 name="book-open" style={styles.icon} />
          <Text style={styles.title}>Welcome to <Text style={styles.highlight}>EDUTRACKER</Text></Text>
          <Text style={styles.tagline}>Your Smart Pathway to Success, Plan and Excel!</Text>
          <Text style={styles.year}>EDUTRACKER @ 2025</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureBox}>
            <MaterialIcons name="quiz" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Take the Quiz</Text>
            <Text style={styles.featureText}>Be yourself and answer honestly to get the best recommendation for your academic or career path.</Text>
          </View>

          <View style={styles.featureBox}>
            <FontAwesome5 name="graduation-cap" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Get Your Results</Text>
            <Text style={styles.featureText}>Discover the SHS strand, college course, or career options that match your interests and skills.</Text>
          </View>

          <View style={styles.featureBox}>
            <FontAwesome5 name="laptop" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Plan Your Future</Text>
            <Text style={styles.featureText}>Use your results to explore schools, scholarships, and career opportunities that fit your potential.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartClick}>
          <Text style={styles.startButtonText}>Start Your Journey!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  icon: {
    fontSize: 80,
    color: "maroon",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  highlight: {
    color: "maroon",
    fontWeight: "bold",
  },
  tagline: {
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 10,
    color: "maroon",
  },
  year: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
  },
  featuresContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 20,
  },
  featureBox: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 50,
    color: "black",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  featureText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    color: "#333",
    lineHeight: 20,
  },
  startButton: {
  
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "maroon",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Index;
