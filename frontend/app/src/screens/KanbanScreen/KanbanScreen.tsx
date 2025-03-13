import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert } from "react-native";
import { getAllTasks, updateStatusKanbanOrder,getStatusKanbanOrderByArtist } from "../../../services/kanbanService"; // Importar servicio de tareas
import { getCommissionsByKanbanOrderId } from "../../../services/CommisionService"; // Importar servicio de comisiones
import { getArtistById } from "@/app/services/ArtistService";
import { getUserTypeById } from "@/app/services/UserService";
import { AuthenticationContext } from "@/app/context/AuthContext";

const KanbanBoard= () => {
  const [tasks, setTasks] = useState<{ [key: string]: any[] }>({
    todo: [],
    inProgress: [],
    done: [],
    completed: [],
    archived: [],
    idea: [],
    sketching: [],
    coloring: [],
    finalTouches: [],
    published: [],
  });

  const { loggedInUser } = useContext(AuthenticationContext);
  const [commissions, setCommissions] = useState<{ [key: string]: any }>({});
 

  // Cargar tareas desde el backend
  useEffect(() => {
    const fetchTasks = async () => {
      const userType = await getUserTypeById(loggedInUser.id);
      if (userType !== "ARTIST" || !loggedInUser) 
        setTasks({
          todo: [],
          inProgress: [],
          done: [],
          completed: [],
          archived: [],
          idea: [],
          sketching: [],
          coloring: [],
          finalTouches: [],
          published: [],
        });
        setCommissions({});
  
      try {
        const artist = await getArtistById(loggedInUser.id);
        setTasks({
          todo: [],
          inProgress: [],
          done: [],
          completed: [],
          archived: [],
          idea: [],
          sketching: [],
          coloring: [],
          finalTouches: [],
          published: [],
        });
        setCommissions({});
  
        const fetchedTasks = await getStatusKanbanOrderByArtist(artist?.id);
        console.log("Tareas obtenidas:", fetchedTasks);
  
        const categorizedTasks = {
          todo: fetchedTasks.filter((task: any) => task.order === 1),
          inProgress: fetchedTasks.filter((task: any) => task.order === 2),
          done: fetchedTasks.filter((task: any) => task.order === 3),
          completed: fetchedTasks.filter((task: any) => task.order === 4),
          archived: fetchedTasks.filter((task: any) => task.order === 5),
          idea: fetchedTasks.filter((task: any) => task.order === 6),
          sketching: fetchedTasks.filter((task: any) => task.order === 7),
          coloring: fetchedTasks.filter((task: any) => task.order === 8),
          finalTouches: fetchedTasks.filter((task: any) => task.order === 9),
          published: fetchedTasks.filter((task: any) => task.order === 10),
        };
  
        setTasks(categorizedTasks);
  
        const commissionsData: { [key: string]: any } = {};
        await Promise.all(
          fetchedTasks.map(async (task: any) => {
            const taskCommissions = await getCommissionsByKanbanOrderId(task.id);
            commissionsData[task.id] = taskCommissions;
          })
        );
  
        setCommissions(commissionsData);
      } catch (error) {
        console.error("Error al cargar tareas", error);
      }
    };
  
    fetchTasks();
  }, [loggedInUser]);

  // Función para obtener el siguiente orden y la columna correspondiente
  const getNextOrder = (task: { order: number; id: any; }) => {
    if (!tasks) return { newOrder: task.order, targetColumn: "" };
  
    const orderMapping = [
      "todo",
      "inProgress",
      "done",
      "completed",
      "archived",
      "idea",
      "sketching",
      "coloring",
      "finalTouches",
      "published",
    ];
  
    const currentIndex = orderMapping.findIndex((col) => tasks[col]?.some((t) => t.id === task.id));
  
    if (currentIndex === -1 || currentIndex >= orderMapping.length - 1) {
      return { newOrder: task.order, targetColumn: "" };
    }
  
    const newOrder = task.order + 1;
    const targetColumn = orderMapping[currentIndex + 1];
  
    return { newOrder, targetColumn };
  };
  

  // Función para mover la tarea entre columnas sin duplicaciones
  const moveTask = async (taskId: number, targetColumn: string, newOrder: number) => {
    try {
      await updateStatusKanbanOrder(taskId, newOrder);

      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        let taskToMove;

        // Eliminar la tarea de su columna actual
        for (const column in updatedTasks) {
          const index = updatedTasks[column].findIndex(task => task.id === taskId);
          if (index !== -1) {
            taskToMove = updatedTasks[column].splice(index, 1)[0];
            break;
          }
        }

        if (taskToMove) {
          taskToMove.order = newOrder;
          updatedTasks[targetColumn].push(taskToMove);
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error("Error al mover la tarea", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>PROYECTOS PERSONALIZADOS</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.kanbanBoard}>
          {Object.entries(tasks).map(([columnName, columnTasks]) => (
            <View key={columnName} style={styles.kanbanColumn}>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{columnName.toUpperCase()}</Text>
              </View>
              {columnTasks.map(task => (
                <View 
                  key={task.id} 
                  style={[styles.taskCard, { backgroundColor: task?.color || "#FFFFFF" }]}
                >
                  <Text style={styles.taskText}>{task.artist_id}</Text>

                  {/* Mostrar detalles de la comisión */}
                  {commissions[task.id] && commissions[task.id].map((commission: any) => (
                    <View key={commission.id}>
                      <Text>Nombre: {commission.name}</Text>
                      <Text>Descripción: {commission.description}</Text>
                      <Text>Precio: {commission.price}</Text>
                      <Text>Acuerdo de pago: {commission.paymentArrangement}</Text>
                    </View>
                  ))}

                  <TouchableOpacity 
                    onPress={() => {
                      const { newOrder, targetColumn } = getNextOrder(task);
                      moveTask(task.id, targetColumn, newOrder);
                    }} 
                    style={styles.moveButton}
                  >
                    <Text style={{ color: "white" }}>{ "Mover"}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default KanbanBoard;

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isBigScreen = width >= 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: isBigScreen ? 40 : 20,
  },
  banner: {
    backgroundColor: "#183771",
    paddingVertical: isBigScreen ? 15 : 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  taskText: {
    fontSize: isMobile ? 14 : 16,
  },
  bannerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: isBigScreen ? 24 : 18,
  },
  kanbanBoard: {
    flexDirection: "row",
    justifyContent: isBigScreen ? "space-between" : "flex-start",
    marginTop: 20,
    paddingHorizontal: isMobile ? 10 : 0,
  },
  kanbanColumn: {
    flex: isBigScreen ? 1 : 0,
    margin: isMobile ? 5 : 10,
    padding: isMobile ? 5 : 15,
    width: isMobile ? 300 : 400,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: isMobile ? 10 : 15,
    marginTop: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  moveButton: {
    backgroundColor: "#183771",
    padding: 7,
    marginTop: 10,
    borderRadius: 5,
    width: isMobile ? "80%" : "33%",
    alignItems: "center",
    alignSelf: "center",
  },
});
