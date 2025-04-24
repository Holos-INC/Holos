import { View, Text, TouchableOpacity,  } from "react-native";
import { useRouter } from "expo-router";
import { DropdownMenu } from "../DropdownMenu";
import { useAuth } from "@/src/hooks/useAuth";
import { deleteWorksDone } from "@/src/services/WorksDoneApi";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";


  interface ReportDropdownProps {
    work: WorksDoneDTO;
    menuVisibleId: number | null; 
    setMenuVisibleId: (id: number | null) => void; 
    isBigScreen: boolean | null;
  }

const ReportDropdown: React.FC<ReportDropdownProps> = ({ work, menuVisibleId, setMenuVisibleId, isBigScreen }) => {
  const { isArtist, isAdmin, loggedInUser } = useAuth();
  const router = useRouter();    

    const showDropDownReport = (work: WorksDoneDTO) => {
        setMenuVisibleId(menuVisibleId === work.id ? null : work.id); // Activa o desactiva el menú solo en la imagen clickeada
      };

    return (
        <View>
            <TouchableOpacity>
            {
              (!isArtist || work.baseUserId != loggedInUser.id) && 
              <DropdownMenu
              actions={[
              {
                label: 'Reportar',
                onPress: () => router.push({ pathname: "/report/[reportId]", params: { reportId: String(work.id) } }),
              }
              ]}
              />
              }
              {
              ((isAdmin || (isArtist && work.baseUserId == loggedInUser.id))) && 
              <DropdownMenu
              actions={[
              {
                label: 'Eliminar',
                onPress: async () => {
                try {
                await deleteWorksDone(work.id);
                console.log("Obra eliminada exitosamente");
                router.back();
                } catch (error) {
                console.error("Error al eliminar la obra:", error);
                }
                },
              }
              ]}
              />
            }
            </TouchableOpacity>
         </View>
    );
  };

  export default ReportDropdown;