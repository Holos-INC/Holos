import { StyleSheet } from "react-native";

export const placeholderColor = "#434343";

export const contactInputStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: "#d8d8d8",
  },
  textInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    flex: 1,
    minWidth: 200,
    height: 30,
    paddingHorizontal: 10,
    marginVertical: 7.5,
    color: placeholderColor,
  },
  inputContainerFocused: {
    borderWidth: 3,
    backgroundColor: '#F3F3F3',
    borderColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});
