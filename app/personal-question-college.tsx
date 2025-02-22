import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRouter } from "expo-router";

const questions = [
    {
        text: "What career path are you currently considering?",
        type: "radio",
        name: "career-path",
        options: [
          "Corporate/Business",
          "Entrepreneurship",
          "Healthcare/Medical Field",
          "Education/Academia",
          "Government/Public Service",
          "IT/Technology",
          "Arts and Creative Industry",
          "Other",
        ],
      },
      {
        text: "How closely is your chosen career related to your college degree?",
        type: "radio",
        name: "career-degree-relation",
        options: [
          "Very closely related",
          "Somewhat related",
          "Not related at all",
        ],
      },
      {
        text: "What is the biggest factor influencing your career choice?",
        type: "radio",
        name: "career-choice-factor",
        options: [
          "Passion and interest",
          "Salary and financial stability",
          "Work-life balance",
          "Job availability",
        ],
      },
      {
        text: "Would you consider shifting to a different field?",
        type: "radio",
        name: "career-shift",
        options: [
          "Yes, if better opportunities arise.",
          "No, I want to stick to my field.",
          "Maybe, if I develop new interests.",
        ],
      },
      {
        text: "How confident are you in securing a job in your field?",
        type: "radio",
        name: "job-confidence-level",
        options: [
          "1-3 (Not confident)",
          "4-6 (Somewhat confident)",
          "7-10 (Very confident)",
        ],
      },
      {
        text: "Are you willing to take further training or certifications?",
        type: "radio",
        name: "further-training",
        options: [
          "Yes, to improve my skills.",
          "No, I feel prepared enough.",
          "Maybe, if required for a job.",
        ],
      },
      {
        text: "What is your biggest fear about working?",
        type: "radio",
        name: "work-fear",
        options: [
          "Difficulty finding a job",
          "Workplace stress and burnout",
          "Low salary and financial struggles",
          "Work-life balance issues",
        ],
      },
      {
        text: "Would you prefer to work in the Philippines or abroad?",
        type: "radio",
        name: "work-location-preference",
        options: ["Philippines", "Abroad", "No preference"],
      },
      {
        text: "How important is work-life balance in choosing your career?",
        type: "radio",
        name: "work-life-balance-importance",
        options: ["Very important", "Somewhat important", "Not important"],
      },
      {
        text: "What kind of support would help you feel more prepared for your career?",
        type: "radio",
        name: "career-preparation-support",
        options: [
          "Career coaching and mentoring",
          "More job market information",
          "Networking and job opportunities",
          "Personal development training",
        ],
      },
    ];

const PQ = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.setItem("pq-answers", JSON.stringify(answers));
  }, [answers]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentQuestionIndex].name]: option,
    }));
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      {showConfetti && <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} />}
      {isFinished ? (
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>🎉 Congratulations! 🎉</Text>
          <Text style={{ textAlign: "center" }}>You have completed all the questions.</Text>
          <TouchableOpacity onPress={() => router.push("Documents")} style={{ marginTop: 20, padding: 10, backgroundColor: "blue", borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Back to Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("Exam")} style={{ marginTop: 10, padding: 10, backgroundColor: "green", borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Go to Exam 📚</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{questions[currentQuestionIndex].text}</Text>
          <FlatList
            data={questions[currentQuestionIndex].options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAnswerChange(item)}
                style={{ padding: 10, marginVertical: 5, backgroundColor: answers[questions[currentQuestionIndex].name] === item ? "#007BFF" : "#ddd", borderRadius: 5 }}>
                <Text style={{ color: answers[questions[currentQuestionIndex].name] === item ? "white" : "black" }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity onPress={handleBack} disabled={currentQuestionIndex === 0} style={{ padding: 10, backgroundColor: currentQuestionIndex === 0 ? "#aaa" : "red", borderRadius: 5, marginRight: 10 }}>
              <Text style={{ color: "white" }}>❮❮</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={{ padding: 10, backgroundColor: "green", borderRadius: 5 }}>
              <Text style={{ color: "white" }}>{currentQuestionIndex < questions.length - 1 ? "❯❯" : "Finish 🎉"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PQ;
