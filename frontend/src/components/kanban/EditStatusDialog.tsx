import colors from '@/src/constants/colors'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { Dialog, Portal, Button, Text, Chip } from 'react-native-paper'

type Props = {
  visible: boolean
  initialName: string
  initialDescription: string
  initialColor: string
  error: string|null,
  onCancel: () => void
  onSave: (data: { name: string; description: string; color: string }) => void
}

export const EditStatusDialog: React.FC<Props> = ({ visible, initialName, initialDescription, initialColor, error, onCancel, onSave }) => {
    const [name, setName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription)
    const [colorHexRaw, setColorHexRaw] = useState(initialColor.replace(/^#/, ''))
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(`#${colorHexRaw}`)

    useEffect(() => {
        setName(initialName)
        setDescription(initialDescription)
        setColorHexRaw(initialColor.replace(/^#/, ''))
    }, [visible])

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel} style={[styles.dialog, { borderRadius: 12 }]}>
                <Dialog.Title>Editar columna</Dialog.Title>
                <Dialog.Content>
                    
                    <View style={styles.preview}>
                        <Chip style={[ styles.chip, { backgroundColor: isValidHex ? `#${colorHexRaw}` : '#ccc' } ]}>
                            <Text style={styles.chipText}>{name || 'Nombre'}</Text>
                        </Chip>
                    </View>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput value={name} onChangeText={setName} style={styles.input} />

                    <Text style={styles.label}>Color (hex)</Text>
                    <View style={styles.hexInputRow}>
                        <Text style={styles.hexPrefix}>#</Text>
                        <TextInput
                            value={colorHexRaw}
                            onChangeText={text => setColorHexRaw(text.replace(/[^0-9a-fA-F]/g, ''))}
                            style={[styles.input, { flex: 1 }]}
                            placeholder="e.g. 33cc99"
                        />
                    </View>
                    {!isValidHex && colorHexRaw.length > 0 && ( <Text style={styles.validationText}>Ups... ese color no es válido.</Text> )}

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput value={description} onChangeText={setDescription} multiline numberOfLines={3} style={[styles.input, { height: 80 }]}/>
                    {error && ( <Text style={styles.validationText}> {error} </Text> )}
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={onCancel}>Cancelar</Button>
                    <Button onPress={() => onSave({ name, description, color: `#${colorHexRaw}` })} disabled={!isValidHex}> Guardar </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    preview: {
        alignItems: 'center',
        marginBottom: 16,
    },
    chip: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    chipText: {
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: 'bold',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#fff',
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    colorButton: {
        width: 32,
        height: 32,
        marginRight: 8,
        borderRadius: 16,
    },
    hexInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    hexPrefix: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
    }, 
    dialog: {
        alignSelf: 'center',
        width: 300,
        maxWidth: '90%',
    },
    validationText: {
        color: colors.brandPrimary,
        fontSize: 12,
        marginTop: 4,
      }      
})
