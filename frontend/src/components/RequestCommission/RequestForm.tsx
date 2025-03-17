import { View, TextInput, Image, Text, TouchableOpacity, Button, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "@/src/styles/RequestCommissionUserScreen.styles";
import { Formik } from "formik";
import { object, string, number } from "yup";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { createCommission } from "@/src/services/formService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { Artist } from "@/src/constants/CommissionTypes";

const cameraIcon = "photo-camera";

interface RequestFormProps {
  artist: Artist;
}

export default function RequestForm({ artist }: RequestFormProps) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const commissionValidationSchema = object({
    name: string().required('Title is required'),
    description: string().required('Description is required'),
    price: number().required('Price is required').positive('Must be positive'),
    numMilestones: number().required('Number of milestones required').positive('Must be positive'),
  });



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleFormSubmit = async (values: { name: string; description: string; price: string; numMilestones: string; }) => {
    try {
      const commissionData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        numMilestones: Number(values.numMilestones),
        paymentArrangement: "INITIAL",
      };

      const createdCommission = await createCommission( artist.id, commissionData, loggedInUser.token );
  
      Alert.alert("Success", "Commission request sent!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create commission.");
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        price: "",
        numMilestones: "",
      }}
      validationSchema={commissionValidationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.title}
            placeholder="Title"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
          />
          {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Describe your request..."
            multiline
            value={values.description}
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
          />
          {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

          <TextInput
            style={styles.title}
            placeholder="Enter the price"
            keyboardType="numeric"
            value={values.price}
            onChangeText={handleChange("price")}
            onBlur={handleBlur("price")}
          />
          {errors.price && touched.price && <Text style={styles.errorText}>{errors.price}</Text>}

          <TextInput
            style={styles.title}
            placeholder="Enter the number of milestones"
            keyboardType="numeric"
            value={values.numMilestones}
            onChangeText={handleChange("numMilestones")}
            onBlur={handleBlur("numMilestones")}
          />
          {errors.numMilestones && touched.numMilestones && <Text style={styles.errorText}>{errors.numMilestones}</Text>}

          <View style={styles.previewContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <Text style={styles.placeholderText}>No image selected</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Icon name={cameraIcon} size={24} />
            </TouchableOpacity>
            <Button title="Submit" onPress={() => handleSubmit()} />
          </View>
        </View>
      )}
    </Formik>
  );
}
