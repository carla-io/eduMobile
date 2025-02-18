import React, { useState } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Correct import
import TextRecognition from 'react-native-text-recognition';

const Documents = () => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  // Function to pick an image or take a picture
  const pickImage = async () => {
    // Request permissions for camera roll and camera
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (mediaLibraryPermission.status !== 'granted' || cameraPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'You need to grant permission to access the camera and gallery.');
      return;
    }

    // Ask the user whether they want to pick an image or take a picture
    Alert.alert(
      'Choose Image Source',
      'Would you like to take a picture or select one from your gallery?',
      [
        {
          text: 'Take a Picture',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.canceled && result.assets?.length > 0) {
              setImageUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Pick from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images, 
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.canceled && result.assets?.length > 0) {
              setImageUri(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Function to extract text from the image
  const extractText = async () => {
    if (imageUri) {
      try {
        const text = await TextRecognition.recognize(imageUri);
        setExtractedText(text.join('\n')); // Join lines for better readability
      } catch (err) {
        Alert.alert('Error', 'Text extraction failed');
      }
    } else {
      Alert.alert('Error', 'No image selected');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick or Take a Picture" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 20 }} />}
      <Button title="Extract Text" onPress={extractText} />
      {extractedText ? (
        <Text style={{ marginTop: 20, paddingHorizontal: 20, textAlign: 'center' }}>{extractedText}</Text>
      ) : null}
    </View>
  );
};

export default Documents;
