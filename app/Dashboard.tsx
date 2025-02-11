import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ScrollView, ActivityIndicator, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem("auth-token");
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post("http://192.168.100.171:4000/api/auth/user", { token });

        console.log("User data:", response.data.user); // Debug API response

        const profilePicture =
          response.data.user.profilePicture?.url || "https://via.placeholder.com/100"; // Ensure correct extraction

        setUser({
          name: response.data.user.name || "Guest",
          gradeLevel: response.data.user.gradeLevel || "Unknown",
          profilePicture,
        });
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#800000" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <View style={{ alignItems: "center" }}>
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
              onError={(e) => console.log("Error loading image:", e.nativeEvent.error)} // Debug image errors
            />
          ) : (
            <Text>No Profile Image Available</Text>
          )}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name}</Text>
          <Text>Current Grade/Year: {user.gradeLevel}</Text>
        </View>
      )}

      {user.name !== "Guest" ? (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 }}>
            Academic Track
          </Text>
          <BarChart
            data={{
              labels: ["GAS", "ABM", "HUMSS", "STEM"],
              datasets: [{ data: [40, 50, 60, 80] }],
            }}
            width={350}
            height={200}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(128, 0, 0, ${opacity})`,
            }}
          />
        </View>
      ) : (
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          Please log in to see your personalized results and predictions.
        </Text>
      )}

      <Button title="View Result" onPress={() => navigation.navigate("Results")} color="#800000" />
    </ScrollView>
  );
};

export default Dashboard;
