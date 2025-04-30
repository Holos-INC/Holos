import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CommissionCard } from "./CommissionCard";
import {
  StatusKanbanCreateDTO,
  StatusKanbanUpdateDTO,
  StatusWithCommissions,
} from "@/src/constants/kanbanTypes";
import { ScrollView } from "react-native-gesture-handler";
import { DropdownMenu } from "../DropdownMenu";
import {
  updateStatusColumn,
  deleteStatusColumn,
} from "@/src/services/kanbanApi";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { EditStatusDialog } from "./EditStatusDialog";

interface KanbanBoardProps {
  columns: StatusWithCommissions[];
  onMoveBack: (commissionId: number) => void;
  onMoveForward: (commissionId: number) => void;
  token: string;
  onDeleteColumn: (deletedId: number) => void;
  onUpdateColumn: (updated: StatusKanbanUpdateDTO) => void;
  onAddColumn: (created: StatusKanbanCreateDTO) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onMoveBack,
  onMoveForward,
  token,
  onDeleteColumn,
  onUpdateColumn,
  onAddColumn,
}) => {
  const [columnIdToDelete, setColumnIdToDelete] = useState<number | null>(null);
  const [editingColumn, setEditingColumn] =
    useState<StatusWithCommissions | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [creatingColumn, setCreatingColumn] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleConfirmDeleteColumn = async () => {
    if (columnIdToDelete === null) return;
    try {
      await deleteStatusColumn(columnIdToDelete, token);
      onDeleteColumn(columnIdToDelete);
    } catch (err) {
      console.error(err);
    } finally {
      setColumnIdToDelete(null);
    }
  };

  const handleConfirmEditColumn = async ({
    name,
    description,
    color,
  }: {
    name: string;
    description: string;
    color: string;
  }) => {
    if (!editingColumn) return;
    try {
      setEditError(null);

      await updateStatusColumn(
        { id: editingColumn.status.id, name: name, description, color },
        token
      );
      onUpdateColumn({
        id: editingColumn.status.id,
        name: name,
        description,
        color,
      });
      setEditingColumn(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Hubo un error al actualizar la columna 😿";
      console.error(message);
      setEditError(message);
    }
  };

  const handleCancel = () => {
    if (editingColumn) setEditError(null);
    if (creatingColumn) setCreateError(null);
    setEditingColumn(null);
    setCreatingColumn(false);
  };

  const handleCreateColumn = async ({
    name,
    description,
    color,
  }: {
    name: string;
    description: string;
    color: string;
  }) => {
    setCreateError(null);
    try {
      await onAddColumn({ name: name, description, color });
      setCreatingColumn(false);
    } catch (err: any) {
      const raw = err?.response?.data;
      const message =
        typeof raw === "string"
          ? raw
          : raw?.message || "No se pudo crear la columna 😿";
      console.error("Hubo un error al crear la columna:", message);
      setCreateError(message);
    }
  };

  const getDropdownActions = (column: StatusWithCommissions) => [
    { label: "Editar", onPress: () => setEditingColumn(column) },
    {
      label: "Eliminar",
      onPress: () => setColumnIdToDelete(column.status.id),
      danger: true,
    },
  ];

  return (
    <ScrollView horizontal contentContainerStyle={styles.board}>
      {columns.map((column, index) => (
        <View
          key={column.status.name}
          style={[
            styles.column,
            { backgroundColor: column.status.color ?? "#f5f5f5" },
          ]}
        >
          <View style={styles.columnHeader}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.columnTitle}
            >
              {column.status.name}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.columnDescription}
            >
              {column.status.description || " "}
            </Text>
            <DropdownMenu actions={getDropdownActions(column)} />
          </View>

          <View style={styles.columnBody}>
            <ScrollView
              style={styles.columnScroll}
              contentContainerStyle={styles.cardList}
              showsVerticalScrollIndicator={false}
            >
              {column.commissions.map((commission) => (
                <CommissionCard
                  key={commission.id}
                  commission={commission}
                  statusIndex={index}
                  maxIndex={columns.length - 1}
                  onMoveBack={() => onMoveBack(commission.id)}
                  onMoveForward={() => onMoveForward(commission.id)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => setCreatingColumn(true)}
        style={styles.addColumnButton}
      >
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>

      {/* Dialogs */}
      <EditStatusDialog
        visible={editingColumn !== null}
        initialName={editingColumn?.status.name ?? ""}
        initialDescription={editingColumn?.status.description ?? ""}
        initialColor={editingColumn?.status.color ?? "#cccccc"}
        onCancel={handleCancel}
        onSave={handleConfirmEditColumn}
        error={editError}
      />
      <DeleteConfirmationDialog
        visible={columnIdToDelete !== null}
        onCancel={() => setColumnIdToDelete(null)}
        onConfirm={handleConfirmDeleteColumn}
      />
      <EditStatusDialog
        visible={creatingColumn}
        initialName=""
        initialDescription=""
        initialColor="#cccccc"
        onCancel={handleCancel}
        onSave={handleCreateColumn}
        error={createError}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  board: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 16,
    height: "100%",
    paddingBlock: 20,
  },
  column: {
    width: 280,
    height: "100%",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  columnScroll: {
    flex: 1,
  },
  cardList: {
    // paddingVertical: 8,
    // gap: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#444",
    lineHeight: 20,
    height: 20,
    overflow: "hidden",
  },
  columnDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
    lineHeight: 16,
    height: 32,
    overflow: "hidden",
  },
  columnHeader: {
    backgroundColor: "white",
    padding: 12,
    width: "100%",
  },
  columnBody: {
    padding: 12,
    flex: 1,
  },
  addColumnButton: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginRight: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#888",
    fontFamily: "monospace",
  },
});
