import React from 'react'
import { Dialog, Portal, Button, Text } from 'react-native-paper'
import colors from '../constants/colors'

type Props = {
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export const DeleteConfirmationDialog: React.FC<Props> = ({ visible, onCancel, onConfirm, title = '¿Eliminar?', message = '¿Estás seguro de que quieres eliminar esto? Esta acción no se puede deshacer.' }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{ borderRadius: 12 }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancelar</Button>
          <Button onPress={onConfirm} textColor={colors.brandPrimary}> Eliminar </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
