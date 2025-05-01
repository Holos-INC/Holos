import React, { useState } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { contactInputStyles, placeholderColor } from '@/src/styles/InputContactUs.styles';

type ContactInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
  isWeb: boolean;
};

const ContactUsTextInput: React.FC<ContactInputProps> = ({ style, isWeb, ...props }) => {
  const [focused, setFocused] = useState(false);

  const containerStyles = [ contactInputStyles.inputContainer, focused && contactInputStyles.inputContainerFocused ];

  const inputStyles = [ contactInputStyles.textInput, style, isWeb ? { outline: 'none' } : {} ];


  return (
    <View style={containerStyles}>
      <TextInput
        {...props}
        style={inputStyles}
        placeholderTextColor={placeholderColor}
        selectionColor={placeholderColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

export default ContactUsTextInput;
