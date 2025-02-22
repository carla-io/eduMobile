import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shsQuiz from "./shsquiz.json";
import collegeQuiz from "./collegequiz.json";
import careerQuiz from "./careerquiz.json";

const Exam = () => {
  const [gradeLevel, setGradeLevel] = useState("");
  const [quizData, setQuizData] = useState({});
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setGradeLevel(parsedUser.gradeLevel || "");

          let selectedQuiz = {};
          if (parsedUser.gradeLevel === "Junior High School") {
            selectedQuiz = shsQuiz;
          } else if (parsedUser.gradeLevel === "Senior High School") {
            selectedQuiz = collegeQuiz;
          } else if (parsedUser.gradeLevel === "College") {
            selectedQuiz = careerQuiz;
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

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Welcome to Your {gradeLevel} Exam
      </Text>
      {Object.keys(quizData).length > 0 ? (
        Object.entries(quizData).map(([section, sectionData], sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{section}</Text>
            <FlatList
              data={sectionData.quiz || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: q, index }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 16 }}>
                    {index + 1}. {q.question}
                  </Text>
                  {q.options?.map((option, optIndex) => (
                    <TouchableOpacity
                      key={optIndex}
                      style={{
                        padding: 10,
                        marginVertical: 5,
                        backgroundColor:
                          answers[section]?.[q.question] === option
                            ? "#4CAF50"
                            : "#f0f0f0",
                        borderRadius: 5,
                      }}
                      onPress={() => handleAnswerChange(section, q.question, option)}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        ))
      ) : (
        <Text>No quiz available for your grade level.</Text>
      )}
    </View>
  );
};

export default Exam;
