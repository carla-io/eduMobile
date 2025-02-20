import React, { useState } from "react";
import { View, Button, Image, Text, Alert, Modal, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";

const SERVER_URL = "http://192.168.175.237:5001/process";

const Documents = () => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async (fileType) => {
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (mediaLibraryPermission.status !== "granted" || cameraPermission.status !== "granted") {
      Alert.alert("Permission Required", "You need to grant permission to access the camera and gallery.");
      return;
    }

    Alert.alert(
      "Choose Image Source",
      "Would you like to take a picture or select one from your gallery?",
      [
        {
          text: "Take a Picture",
          onPress: async () => handleImagePick(await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 }), fileType),
        },
        {
          text: "Pick from Gallery",
          onPress: async () => handleImagePick(await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 }), fileType),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleImagePick = async (result, fileType) => {
    if (!result.canceled && result.assets?.length > 0) {
      const compressedImage = await compressImage(result.assets[0].uri);
      setImageUri(compressedImage.uri);
      uploadImageToServer(compressedImage.uri, fileType);
    }
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG });
    console.log("Compressed image:", result);
    return result;
  };

  const uploadImageToServer = async (imageUri, fileType) => {
    try {
      const formData = new FormData();
      formData.append(fileType, {
        uri: imageUri,
        type: "image/jpeg",
        name: `${fileType}_image.jpg`,
      });

      console.log("Uploading to:", SERVER_URL);
      console.log("Form Data:", formData);

      const response = await axios.post(SERVER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend Response:", response.data);
      setExtractedText(JSON.stringify(response.data[fileType], null, 2));
      setModalVisible(true);
    } catch (error) {
      console.error("Axios Error:", error);
      Alert.alert("Network Error", `Failed to process image: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Upload Grade Sheet" onPress={() => pickImage("grades")} />
      <Button title="Upload Certificate" onPress={() => pickImage("certificates")} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 20 }} />}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Extracted Text</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text>{extractedText}</Text>
            </ScrollView>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Documents;
