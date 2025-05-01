import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import { getReportTypes, postReportWork } from "@/src/services/ReportService";
import { Button } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import styles from "@/src/styles/ReportScreen.styles";
import popUpMovilWindows from "@/src/components/PopUpAlertMovilWindows";
import { API_URL } from "@/src/constants/api";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { getImageSource } from "@/src/utils/getImageSource";

export interface ReportDTO {
  name: string;
  description: string;
  workId: number;
  reportType: string;
}

export interface Work {
  id: number;
  name: string;
  description: string;
  price: number;
  artist: Artist;
  image: string;
}

export interface Artist {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  tableCommisionsPrice?: string;
}

export default function ReportScreen() {
  const { reportId } = useLocalSearchParams();
  const numberWorkId = Number(reportId);

  const { loggedInUser, isAuthenticated } = useContext(AuthenticationContext);
  const [reportTitle, setReportTitle] = useState<string>("");
  const [report, setReport] = useState("");
  const [work, setWork] = useState<WorksDoneDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportTypes, setReportTypes] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectedReportType, setSelectedReportType] = useState<number | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const data = await getReportTypes();
        // Convertir los datos para el dropdown

        const formattedTypes = data.map(
          (type: { id: number; type: string }) => ({
            label: type.type,
            value: type.id,
          })
        );

        setReportTypes(formattedTypes);
      } catch (error) {
        console.error("Hubo un error al cargar los tipos:", error);
        setReportTypes([]);
      }
    };
    fetchReportTypes();

    const fetchWork = async () => {
      if (!reportId) return;
      try {
        const data = await getWorksDoneById(numberWorkId);
        setWork(data);
      } catch (error) {
        console.error(
          "Hubo un error al cargar los detalles de la obra:",
          error
        );
        setWork(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [numberWorkId]);

  useEffect(() => {
    navigation.setOptions({ title: `${work?.name}` });
  }, [navigation, work]);

  const handleSubmit = async () => {
    if (!work) {
      popUpMovilWindows(
        "Error",
        "No se puede reportar esta obra porque falta información."
      );
      return;
    }

    if (!reportTitle && !selectedReportType && !report.trim()) {
      popUpMovilWindows(
        "Error",
        "Por favor, rellene el reporte antes de poder enviarlo"
      );
      return;
    }

    if (!reportTitle) {
      popUpMovilWindows(
        "Error",
        "Por favor, escriba un titulo descriptivo del reporte "
      );
      return;
    }

    if (!selectedReportType) {
      popUpMovilWindows("Error", "Por favor, selecciona un tipo de reporte ");
      return;
    }

    if (!report.trim()) {
      popUpMovilWindows("Error", "Por favor,  escribe una descripción.");
      return;
    }

    const ReportDTO = {
      name: reportTitle,
      description: report,
      workId: work.id,
      reportType: reportTypes.find((type) => type.value === selectedReportType)
        ?.label,
    };

    try {
      await postReportWork(ReportDTO, loggedInUser.token);
      popUpMovilWindows("Éxito", "Reporte enviado correctamente");
      cleanStatus();
    } catch (error: any) {
      if (error.response?.status === 400) {
        popUpMovilWindows(
          "¡Ya reportaste esta obra!",
          "No puedes enviar el mismo reporte dos veces 😵‍💫"
        );
        cleanStatus();
      } else {
        popUpMovilWindows("Error", "No se pudo enviar el reporte");
      }
    }
  };

  const cleanStatus = () => {
    setReportTitle("");
    setReport("");
    setSelectedReportType(null);
    router.push({ pathname: "/" });
  };

  const handleSingIn = () => {
    router.push({ pathname: "/login", params: { reportId: reportId } });
  };

  const userRegister = () => {
    return loading ? (
      <>
        <Text style={styles.title}>
          Reportar obra del artista: {work?.artistName}
        </Text>
        <Text style={styles.loading}>Cargando detalles de la obra...</Text>
      </>
    ) : work ? (
      <>
        <Text style={styles.title}>
          Reportar obra del artista: {work?.artistName}
        </Text>

        <TouchableOpacity
          onPress={() => router.push(`/work/${numberWorkId}`)}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← ATRÁS</Text>
        </TouchableOpacity>

        <View style={{ position: "relative" }}>
          {work.image ? (
            <Image
              source={getImageSource(work.image)}
              style={styles.artworkImage}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: "#aaa" }}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Nombre de la obra */}
        <Text style={styles.artworkTitle}>{work.name}</Text>

        {/* Nombre del artista */}
        <Text style={styles.artistName}>Artista: {work.artistName}</Text>

        {/* Campo de texto para el título del reporte */}
        <Text>Escriba el título de su reporte:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe un título para el reporte..."
          value={reportTitle}
          onChangeText={setReportTitle}
        />
        <Text>Seleccione el tipo de reporte:</Text>

        {/* Dropdown de tipos de reporte */}
        <DropDownPicker
          open={dropdownOpen}
          value={selectedReportType}
          items={reportTypes}
          setOpen={setDropdownOpen}
          setValue={setSelectedReportType}
          setItems={setReportTypes}
          placeholder="Selecciona un tipo de reporte"
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
        />

        <Text>Describa el motivo de su reporte:</Text>

        {/* Campo de texto para el reporte */}
        <TextInput
          style={styles.input}
          placeholder="Escribe el motivo del reporte..."
          value={report}
          onChangeText={setReport}
          multiline
        />

        {/* Botón de enviar */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </>
    ) : (
      <Text style={styles.errorText}>No se encontró la obra</Text>
    );
  };

  const userNotRegister = () => {
    return (
      <>
        <View style={styles.containerNotRegister}>
          <View style={styles.containerContentNotRegister}>
            <Text style={styles.textContainerNotRegister}>
              Debe registrarse para poder reportar una obra
            </Text>
            <Button
              mode="contained"
              onPress={handleSingIn}
              style={styles.singInButton}
            >
              Abrir Sesión
            </Button>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? userRegister() : userNotRegister()}
    </View>
  );
}
