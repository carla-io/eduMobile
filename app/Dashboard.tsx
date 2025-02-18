import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const portalImg = require("./assets/portal.png");
const uploadImg = require("./assets/upload.png");
const certificateImg = require("./assets/certificate.png");
const personalImg = require("./assets/personal.png");
const examImg = require("./assets/exam.png");
import { router } from "expo-router";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", gradeLevel: "", profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const apiUrl = "https://backend-6ioq.onrender.com";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem("auth-token");
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${apiUrl}/api/auth/user`, { token });

        console.log("User data:", response.data.user);

        const profilePicture =
          response.data.user.profilePicture?.url || "https://via.placeholder.com/100";

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
              onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
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

      <Button title="View Result" onPress={() => router.push("/Results")} color="#800000" />

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Instructions</Text>
        <View>
          {[ 
            { img: portalImg, text: "To start predicting your future strand, course, or career, the first step is to select the appropriate portal based on your educational level." },
            { img: uploadImg, text: "Once you've selected the right portal, the next step is to upload a clear picture or file of your current grades in PNG, JPG, JPEG, or PDF." },
            { img: certificateImg, text: "After uploading your grades, submit any seminar or school-related certificates (max 10 uploads) in JPEG, JPG, or PNG." },
            { img: personalImg, text: "Following this, you will answer personal questions designed to influence your decision-making in choosing the right strand, course, or career." },
            { img: examImg, text: "Finally, to ensure a comprehensive evaluation, you will take subject-based exams that assess your knowledge and skills." }
          ].map((item, index) => (
            <View key={index} style={{ alignItems: "center", marginBottom: 15 }}>
              <Image source={item.img} style={{ width: 80, height: 80, marginBottom: 5 }} />
              <Text style={{ textAlign: "center" }}>{item.text}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "#800000", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 , marginBottom:30}}
          onPress={() =>router.push("Portal")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Start the Process</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
