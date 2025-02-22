import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const questions = [
  {
    text: "What is your dream college course choice?",
    type: "radio",
    name: "college-course-choice",
    options: [
      "Engineering/Technology",
      "Business/Management",
      "Medicine/Health Sciences",
      "Education",
      "Social Sciences/Humanities",
      "IT/Computer Science",
      "Arts, Media, and Design",
      "Law/Political Science",
      "Other",
    ],
  },
  {
    text: "Do you want to take a college course related to your SHS strand?",
    type: "radio",
    name: "shs-course-relation",
    options: [
      "Yes, I want to continue in the same field.",
      "No, I want to shift to a different field.",
      "I'm still unsure.",
    ],
  },
  // More questions...
];

const PersonalQuestions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const storedAnswers = await AsyncStorage.getItem("pq-answers");
        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
        }
      } catch (error) {
        console.error("Error loading answers", error);
      }
    };
    loadAnswers();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("pq-answers", JSON.stringify(answers));
  }, [answers]);

  const handleNext = () => {
    if (!answers[questions[currentQuestionIndex].name]) {
      Alert.alert("Required", "Please select an answer before proceeding.");
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      Alert.alert("🎉 Congratulations!", "You have completed all the questions.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {isFinished ? (
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>🎉 Congratulations! 🎉</Text>
          <TouchableOpacity onPress={() => router.push("Documents")} style={{ padding: 10, backgroundColor: "maroon", marginTop: 20 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Back to Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("Exam")} style={{ padding: 10, backgroundColor: "maroon", marginTop: 10 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Go to Exam 📚</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{`${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].text}`}</Text>
          <ScrollView>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setAnswers((prev) => ({ ...prev, [questions[currentQuestionIndex].name]: option }))}
                style={{
                  padding: 10,
                  marginVertical: 5,
                  backgroundColor: answers[questions[currentQuestionIndex].name] === option ? "maroon" : "lightgray",
                }}>
                <Text style={{ color: "white" }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              style={{ padding: 10, backgroundColor: "gray" }}>
              <Text style={{ color: "white" }}>❮❮ Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={{ padding: 10, backgroundColor: "maroon" }}>
              <Text style={{ color: "white" }}>{currentQuestionIndex < questions.length - 1 ? "❯❯ Next" : "Finish 🎉"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PersonalQuestions;
