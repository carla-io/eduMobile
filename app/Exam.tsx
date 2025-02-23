import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shsQuiz from "./shsquiz.json";
import collegeQuiz from "./collegequiz.json";
import careerQuiz from "./careerquiz.json";

const Exam = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const [quizData, setQuizData] = useState([]);
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
          
          let selectedQuiz = [];
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
              selectedQuiz = [];
          }
          setQuizData(Object.entries(selectedQuiz));
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
      [`${section}-${question}`]: selectedOption,
    }));
  };

  const handleFinishExam = () => {
    let newScores = {};
    quizData.forEach(([section, sectionData]) => {
      if (Array.isArray(sectionData.quiz)) {
        const totalQuestions = sectionData.quiz.length;
        const correctAnswers = sectionData.quiz.filter(q => answers[`${section}-${q.question}`] === q.answer).length;
        newScores[section] = `${correctAnswers} / ${totalQuestions}`;
      }
    });
    setScores(newScores);
    Alert.alert("Exam Completed", "Your answers have been submitted.");
  };

  const renderQuestion = useCallback(({ item: [section, sectionData] }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{section}</Text>
      {sectionData.quiz?.map((q, index) => (
        <View key={index} style={{ marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>{q.question}</Text>
          {(q.options || q.choices)?.map((option, optIndex) => (
            <TouchableOpacity
              key={optIndex}
              style={{
                padding: 10,
                marginVertical: 5,
                backgroundColor: answers[`${section}-${q.question}`] === option ? "maroon" : "lightgray",
                borderRadius: 5,
              }}
              onPress={() => handleAnswerChange(section, q.question, option)}
            >
              <Text style={{ color: "white" }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  ), [answers]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
        Welcome to Your {gradeLevel} Exam
      </Text>
      {quizData.length > 0 ? (
        <FlatList
          data={quizData}
          keyExtractor={([section]) => section}
          renderItem={renderQuestion}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
        />
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
            <Text key={index} style={{ fontSize: 18, textAlign: "center" }}>{section}: {score}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default Exam;
