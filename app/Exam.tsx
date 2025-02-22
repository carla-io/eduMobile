import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shsQuiz from "./shsquiz.json";
import collegeQuiz from "./collegequiz.json";
import careerQuiz from "./careerquiz.json";

const Exam = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const [quizData, setQuizData] = useState({});
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const gradeLevel = parsedUser.gradeLevel || "";
          setGradeLevel(gradeLevel);
          
          let selectedQuiz = {};
          switch (gradeLevel.trim().toLowerCase()) {
            case "jhs":
            case "junior high school":
              selectedQuiz = shsQuiz;
              break;
            case "shs":
            case "senior high school":
              selectedQuiz = collegeQuiz;
              break;
            case "college":
              selectedQuiz = careerQuiz;
              break;
            default:
              selectedQuiz = {};
          }
          setQuizData(selectedQuiz);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleAnswerChange = (section, question, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: selectedOption,
      },
    }));
  };

  const handleFinishExam = () => {
    let newScores = {};
    let totalScore = 0;
    let totalQuestions = 0;
    
    Object.entries(quizData).forEach(([section, sectionData]) => {
      if (Array.isArray(sectionData.quiz)) {
        const sectionTotalQuestions = sectionData.quiz.length;
        const sectionCorrectAnswers = sectionData.quiz.filter(
          (q) => answers[section]?.[q.question] === q.answer
        ).length;
        
        newScores[section] = {
          correct: sectionCorrectAnswers,
          total: sectionTotalQuestions,
          percentage: ((sectionCorrectAnswers / sectionTotalQuestions) * 100).toFixed(2) + "%"
        };

        totalScore += sectionCorrectAnswers;
        totalQuestions += sectionTotalQuestions;
      }
    });
    
    if (totalQuestions > 0) {
      newScores["Overall"] = {
        correct: totalScore,
        total: totalQuestions,
        percentage: ((totalScore / totalQuestions) * 100).toFixed(2) + "%"
      };
    }
    
    setScores(newScores);
    Alert.alert("Exam Completed", "Your answers have been submitted.");
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
        Welcome to Your {gradeLevel} Exam
      </Text>
      {Object.keys(quizData).length > 0 ? (
        Object.entries(quizData).map(([section, sectionData], sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{section}</Text>
            {Array.isArray(sectionData.quiz) ? (
              sectionData.quiz.map((q, index) => (
                <View key={index} style={{ marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>{index + 1}. {q.question}</Text>
                  {(q.options || q.choices)?.map((option, optIndex) => (
                    <TouchableOpacity
                      key={optIndex}
                      style={{
                        padding: 10,
                        marginVertical: 5,
                        backgroundColor: answers[section]?.[q.question] === option ? "maroon" : "lightgray",
                        borderRadius: 5,
                      }}
                      onPress={() => handleAnswerChange(section, q.question, option)}
                    >
                      <Text style={{ color: "white" }}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            ) : (
              <Text>No questions available for this section.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No quiz available for your grade level.</Text>
      )}
      <TouchableOpacity
        style={{ backgroundColor: "blue", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" }}
        onPress={handleFinishExam}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Finish Exam</Text>
      </TouchableOpacity>
      {Object.keys(scores).length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Exam Scores</Text>
          {Object.entries(scores).map(([section, score], index) => (
            <Text key={index} style={{ fontSize: 18, textAlign: "center" }}>
              {section}: {score.correct} / {score.total} ({score.percentage})
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Exam;
