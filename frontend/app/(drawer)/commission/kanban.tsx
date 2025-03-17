import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from "react-native";
import { getAllTasks, updateStatusKanbanOrder } from "@/src/services/kanbanService";
import ProtectedRoute from "@/src/components/ProtectedRoute";

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: any[] }>({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Cargar tareas desde el backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks();
        const categorizedTasks = {
          todo: fetchedTasks.filter((task: any) => task.order === 1),
          inProgress: fetchedTasks.filter((task: any) => task.order === 2),
          done: fetchedTasks.filter((task: any) => task.order === 3),
        };
        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error al cargar tareas", error);
      }
    };
    fetchTasks();
  }, []);

  // Función para obtener el siguiente orden y la columna correspondiente
  const getNextOrder = (task: any) => {
    let newOrder = task.order;
    let targetColumn = "";

    if (task.order === 1) {
      newOrder = 2;
      targetColumn = "inProgress";
    } else if (task.order === 2) {
      newOrder = 3;
      targetColumn = "done";
    } else if (task.order === 3) {
      newOrder = 3;
      targetColumn = "done";
    }

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
    <ProtectedRoute allowedRoles={["ARTIST"]}>
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
                  <View key={task.id} style={styles.taskCard}>
                    <Text style={styles.taskText}>{task.artist_id}</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        const { newOrder, targetColumn } = getNextOrder(task);
                        moveTask(task.id, targetColumn, newOrder);
                      }} 
                      style={styles.moveButton}
                    >
                      <Text style={{ color: "white" }}>
                        {task.order === 3 ? "Archivar" : "Mover"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ProtectedRoute>
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
