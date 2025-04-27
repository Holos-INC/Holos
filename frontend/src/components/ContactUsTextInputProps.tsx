import React, { useState } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { contactInputStyles, placeholderColor } from "@/src/styles/InputContactUs.styles";

type ContactInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  isWeb?: boolean;
};

export const ContactInput: React.FC<ContactInputProps> = ({
  containerStyle,
  style,
  placeholder,
  isWeb,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[
      contactInputStyles.inputContainer,
      focused && contactInputStyles.inputContainerFocused,
      containerStyle,
    ]}>
      <TextInput
        style={[
          contactInputStyles.textInput,
          style,
          isWeb ? { outline: 'none' } : {},
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        selectionColor={placeholderColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
};

export default ContactInput;
