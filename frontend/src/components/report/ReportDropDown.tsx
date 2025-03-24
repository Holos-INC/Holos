import React, { useState } from "react";
import { View, Text, TouchableOpacity,  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import stylesReport from "@/src/styles/ReportButton.styles";



  interface ReportDropdownProps {
    workId: number;
    menuVisibleId: number | null; 
    setMenuVisibleId: (id: number | null) => void; 
    isBigScreen: boolean | null;
  }

const ReportDropdown: React.FC<ReportDropdownProps> = ({ workId, menuVisibleId, setMenuVisibleId, isBigScreen }) => {
    const router = useRouter();

    const showDropDownReport = (workId: number) => {
        setMenuVisibleId(menuVisibleId === workId ? null : workId); // Activa o desactiva el menú solo en la imagen clickeada
      };
  
    return (
         <View>
            <TouchableOpacity onPress={(e) => {
            e.stopPropagation(); // Evita que el toque cierre el menú
            showDropDownReport(workId);}}
            style={ isBigScreen === true ? stylesReport.menuButtonBigScreen:  stylesReport.menuButton } >
              <Ionicons name="ellipsis-vertical" size={24} color="gray" />
   
                      </TouchableOpacity>
    
                      {/* Menú desplegable*/}
                      {menuVisibleId === workId && (
                        <View style={stylesReport.menu}>
                          <TouchableOpacity
                            onPress={() => {
                              setMenuVisibleId(null);
                              router.push({ pathname: "/report/[reportId]", params: { reportId: String(workId) } }); // Navega a la pantalla de reporte
                            }}
                            style={stylesReport.menuItem}
                          >
                            <Text style={stylesReport.menuItemText}>Reportar</Text>
                          </TouchableOpacity>
                        </View>
                      )}
    </View>
    );
  };

  export default ReportDropdown;