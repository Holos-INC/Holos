import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Menu, IconButton } from 'react-native-paper'
import colors from '../constants/colors'

type DropdownAction = {
  label: string
  onPress: () => void
  danger?: boolean
}

type DropdownMenuProps = {
  actions: DropdownAction[]
  style?: any
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ actions, style }) => {
  const [visible, setVisible] = useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={styles.menuStyle}
        anchor={ <IconButton icon="dots-horizontal" size={20} onPress={openMenu} style={styles.icon}/>}
      >
        {actions.map((action, index) => (
          <Menu.Item
            key={index}
            onPress={() => { action.onPress(); closeMenu(); }}
            title={action.label}
            titleStyle={[ styles.itemTitle, action.danger ? styles.dangerText : undefined ]}
          />
        ))}
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  icon: {
    margin: 0,
  },
  dangerText: {
    color: colors.brandPrimary,
  },
  menuStyle: {
    borderRadius: 10,
    paddingVertical: 4,
    minWidth: 140,
    backgroundColor: colors.surfaceBase,
    elevation: 4,
    
  },
  itemTitle: {
    fontSize: 13,
  },
})
