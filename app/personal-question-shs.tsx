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
      {
        text: "Why did you decide to continue or shift from your SHS strand?",
        type: "radio",
        name: "shs-course-decision",
        options: [
          "I enjoy my SHS strand and want to pursue it further.",
          "I discovered new interests outside my strand.",
          "My SHS strand does not match my career goals.",
          "My parents/guardians influenced my decision.",
          "Job demand and salary influenced my choice.",
        ],
      },
      {
        text: "How will you decide on your college course?",
        type: "radio",
        name: "college-course-decision",
        options: [
          "Based on my personal interests and passion",
          "High demand in the job market",
          "Family influence",
          "Academic strength in related subjects",
          "Potential salary and financial stability",
        ],
      },
      {
        text: "Do you feel pressured to take a specific course?",
        type: "radio",
        name: "college-course-pressure",
        options: [
          "Yes, by my parents/family.",
          "Yes, by society or job demand.",
          "No, I am choosing freely.",
        ],
      },
      {
        text: "How important is job availability in your decision?",
        type: "radio",
        name: "job-availability-importance",
        options: [
          "Very important",
          "Somewhat important",
          "Not important, passion matters more",
        ],
      },
      {
        text: "What is your biggest concern in choosing a course?",
        type: "radio",
        name: "college-course-concern",
        options: [
          "Difficulty of the course",
          "Tuition fees and financial constraints",
          "Future job opportunities",
          "Workload and stress level",
        ],
      },
      {
        text: "Have you considered taking a gap year?",
        type: "radio",
        name: "gap-year-consideration",
        options: [
          "Yes, to explore options or work first.",
          "No, I want to proceed immediately.",
          "Maybe, depending on circumstances.",
        ],
      },
      {
        text: "How confident are you in your chosen course?",
        type: "radio",
        name: "college-confidence-level",
        options: [
          "1-3 (Not confident)",
          "4-6 (Somewhat confident)",
          "7-10 (Very confident)",
        ],
      },
      {
        text: "What support would help you decide better?",
        type: "radio",
        name: "college-decision-support",
        options: [
          "Career counseling and guidance",
          "More exposure to professionals in the field",
          "Internship or shadowing opportunities",
          "Financial aid or scholarship options",
        ],
      },
    ];

const PersonalQuestions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const navigation = useNavigation();
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      Alert.alert("🎉 Congratulations!", "You have completed all the questions.");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].name]: option,
    }));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {isFinished ? (
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
            🎉 Congratulations! 🎉
          </Text>
          <TouchableOpacity onPress={() =>router.push("Documents")}
            style={{ padding: 10, backgroundColor: "maroon", marginTop: 20 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Back to Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("Exam")}
            style={{ padding: 10, backgroundColor: "maroon", marginTop: 10 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Go to Exam 📚</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{questions[currentQuestionIndex].text}</Text>
          <ScrollView>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerChange(option)}
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
            <TouchableOpacity onPress={handleBack} disabled={currentQuestionIndex === 0}
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
