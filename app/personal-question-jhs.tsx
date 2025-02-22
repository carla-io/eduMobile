import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const questions = [
  {
    text: "What subject do you consider your strongest?",
    type: "radio",
    name: "strongest-subject",
    options: [
      "Math",
      "Science",
      "English",
      "Filipino",
      "Social Studies",
      "TLE (Technical-Vocational)",
      "Arts and Music",
      "PE and Sports",
    ],
  },
  {
    text: "What field are you most interested in for your future career?",
    type: "radio",
    name: "career-field",
    options: [
      "Science, Technology, Engineering, and Mathematics (STEM)",
      "Business and Entrepreneurship",
      "Social Sciences and Humanities",
      "Arts, Media, and Communication",
      "Technical/Vocational and Skilled Work",
      "Sports and Fitness",
    ],
  },
  {
    text: "What are your top three Senior High School strand choices?",
    type: "radio",
    name: "shs-strand",
    options: ["STEM", "ABM", "HUMSS", "TVL", "GAS", "Arts and Design", "Sports"],
  },
  {
    text: "Why are you choosing your preferred SHS strand?",
    type: "radio",
    name: "shs-reason",
    options: [
      "It matches my subject strengths.",
      "It aligns with my future career goals.",
      "My family or teachers advised me to take it.",
      "It has better job opportunities in the future.",
      "I am still exploring my options.",
    ],
  },
  {
    text: "Are you confident that your chosen strand will help you in college or work?",
    type: "radio",
    name: "shs-confidence",
    options: [
      "Yes, I am sure it’s the right choice.",
      "Maybe, but I might change my mind later.",
      "No, I’m unsure about my future plans.",
    ],
  },
  {
    text: "Do you feel well-informed about the different SHS strands?",
    type: "radio",
    name: "shs-informed",
    options: [
      "Yes, I understand them well.",
      "Somewhat, but I need more information.",
      "No, I still have many questions.",
    ],
  },
  {
    text: "Who or what has the biggest influence on your SHS strand decision?",
    type: "radio",
    name: "shs-influence",
    options: [
      "Parents or family",
      "Friends or classmates",
      "Teachers or guidance counselors",
      "Social media or online resources",
      "My personal interests and strengths",
    ],
  },
  {
    text: "Would you consider changing strands if given the chance?",
    type: "radio",
    name: "shs-change",
    options: [
      "Yes, I am still unsure about my choice.",
      "No, I am confident in my decision.",
      "Maybe, if I find a better fit.",
    ],
  },
  {
    text: "How confident are you in your chosen strand?",
    type: "radio",
    name: "shs-confidence-level",
    options: [
      "1-3 (Not confident)",
      "4-6 (Somewhat confident)",
      "7-10 (Very confident)",
    ],
  },
  {
    text: "What would help you feel more confident in choosing a strand?",
    type: "radio",
    name: "shs-confidence-help",
    options: [
      "Career orientation or seminars",
      "More guidance from teachers and counselors",
      "More information about job opportunities",
      "Personal experience or internships",
    ],
  },
];

const PQ = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadAnswers = async () => {
      const storedAnswers = await AsyncStorage.getItem("pq-answers");
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
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

  const handleProceedToExam = () => {
    router.push("/exam");
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {isFinished ? (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            🎉 Congratulations! 🎉
          </Text>
          <Text>You have completed all the questions.</Text>
          <TouchableOpacity
            style={{ backgroundColor: "maroon", padding: 10, borderRadius: 5, marginTop: 20 }}
            onPress={handleProceedToExam}
          >
            <Text style={{ color: "white" }}>Go to Exam 📚</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            {questions[currentQuestionIndex].text}
          </Text>
          <ScrollView>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerChange(option)}
                style={{
                  padding: 10,
                  marginVertical: 5,
                  backgroundColor:
                    answers[questions[currentQuestionIndex].name] === option
                      ? "maroon"
                      : "#ddd",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: answers[questions[currentQuestionIndex].name] === option ? "white" : "black" }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={currentQuestionIndex === 0}
              style={{ backgroundColor: "gray", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white" }}>❮❮ Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={{ backgroundColor: "maroon", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white" }}>
                {currentQuestionIndex < questions.length - 1 ? "Next ❯❯" : "Finish 🎉"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PQ;
