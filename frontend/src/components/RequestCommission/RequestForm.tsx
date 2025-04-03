import { View, TextInput, Image, Text, TouchableOpacity, Button, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "@/src/styles/RequestCommissionUserScreen.styles";
import { Formik } from "formik";
import { object, string, number, date } from "yup";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { createCommission } from "@/src/services/formService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { Artist, PaymentArrangement } from "@/src/constants/CommissionTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { router } from "expo-router";

const cameraIcon = "photo-camera";

interface RequestFormProps {
  artist: Artist;
}

type FormValues = {
  name: string;
  description: string;
  price: number;
  image: string;
  milestoneDate: Date | null;
};

export default function RequestForm({ artist }: RequestFormProps) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const commissionValidationSchema = object({
    name: string().required('Title is required'),
    description: string().required("Description is required"),
    price: number().required('Price is required').positive('Must be positive'),
    image: string(),
    milestoneDate: date().nullable().min(new Date(new Date().setDate(new Date().getDate() + 1)), "Date must be after today!"),
  });

  const pickImage = async (setFieldValue: (field: string, value: any) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setFieldValue("image", uri);
    }
  };
  
  const handleFormSubmit = async (values: FormValues)=> {
    try {
      const commissionData = {
        name: values.name,
        description: values.description,
        price: values.price,
        paymentArrangement: PaymentArrangement.INITIAL,
        image: values.image,
        milestoneDate: values.milestoneDate?.toISOString().slice(0, 10),
      };

      const createdCommission = await createCommission(artist.id, commissionData, loggedInUser.token);
      setTimeout(() => {
        router.push(`/commissions/${createdCommission.id}/checkout`);
      }, 2000);
  
      Alert.alert("Success", "Commission request sent!");
    } catch (error) {
      Alert.alert("Error", "Failed to create commission.");
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{name: "",description: "",price: 0,image: "",milestoneDate: null}}
      validationSchema={commissionValidationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (

        <View style={styles.formContainer}>
          {/* Title Field */}
          <TextInput
            style={styles.title}
            placeholder="Title"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
          />
          {errors.name && touched.name && ( <Text style={styles.errorText}>{errors.name}</Text> )}
        
          {/* Description Field */}
          <TextInput
            style={styles.input}
            placeholder="Describe your request..."
            multiline
            value={values.description}
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
          />
          {errors.description && touched.description && ( <Text style={styles.errorText}>{errors.description}</Text> )}
        
          {/* Price Field */}
          <TextInput
            style={styles.title}
            placeholder="Enter the price"
            keyboardType="numeric"
            value={values.price === 0 ? "" : values.price.toString()}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              if (numericValue === "") {
                setFieldValue("price", "");
              } else {
                setFieldValue("price", Number(numericValue));
              }
            }}
            onBlur={handleBlur("price")}
          />
          {errors.price && touched.price && ( <Text style={styles.errorText}>Please insert a numeric value</Text> )}

          {/* Date Picker Trigger */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {values.milestoneDate
                ? `Selected: ${values.milestoneDate.toLocaleDateString()}`
                : "Select a delivery date"}
            </Text>
          </TouchableOpacity>
          {errors.milestoneDate && touched.milestoneDate && (
            <Text style={styles.errorText}>{errors.milestoneDate}</Text>
          )}

          {Platform.OS === "web" ? (
            <input
              type="date"
              onChange={(e) => { const date = new Date(e.target.value); setFieldValue("milestoneDate", date);}}
              style={{ padding: 10, borderRadius: 6 }}
            />
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={values.milestoneDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => { setShowDatePicker(false); if (selectedDate) { setFieldValue("milestoneDate", selectedDate);}}}
              />
            )
          )}
        
          {/* Image Preview */}
          <View style={styles.previewContainer}>
            {values.image ? (
              <Image source={{ uri: values.image }} style={styles.previewImage} />
            ) : (
              <Text style={styles.placeholderText}>No image selected</Text>
            )}
          </View>
        
          {/* Image Picker + Submit */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
              <Icon name={cameraIcon} size={24} />
            </TouchableOpacity>
            <Button title="Submit" onPress={() => handleSubmit()} />
          </View>
      </View>      
      )}
    </Formik>
  );
}
