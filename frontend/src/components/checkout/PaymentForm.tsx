import React, { useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

type PaymentFormProps = {
    onChange: (values: { cardNumber: string; cardName: string; exp: string }) => void;
    price: number;
}; 

const PaymentForm = ({ onChange, price }: PaymentFormProps) => {
    const validation = Yup.object({
        cardNumber: Yup.string().matches(/^[0-9\s]{16,19}$/, 'Invalid card number').required('Required'),
        cardName: Yup.string().required('Required'),
        exp: Yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiration').required('Required'),
        cvv: Yup.string().matches(/^[0-9]{3,4}$/, 'Invalid CVV').required('Required')
    });

    const onSubmit = (values:any) => {
        const sanitizedCardNumber = values.cardNumber.replace(/\s/g, '');
        console.log('Sanitized Card:', {
          ...values,
          cardNumber: sanitizedCardNumber
        });
        console.log('Amount:', price);
    };      

    return (
        <Formik
            initialValues={{ cardNumber: '', cardName: '', exp: '', cvv: '' }}
            validationSchema={validation}
            onSubmit={onSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                useEffect(() => { onChange({ cardNumber: values.cardNumber, cardName: values.cardName, exp: values.exp });
                }, [values.cardNumber, values.cardName, values.exp]);

                return (
                    <View style={styles.form}>
                        <TextInput
                            textContentType="creditCardNumber"
                            style={styles.input}
                            placeholder="Card Number"
                            keyboardType="number-pad"
                            onChangeText={handleChange('cardNumber')}
                            onBlur={handleBlur('cardNumber')}
                            value={values.cardNumber}
                            autoComplete="cc-number"
                        />
                        {touched.cardNumber && errors.cardNumber && ( <Text style={styles.error}>{errors.cardNumber}</Text> )}

                        <TextInput
                            textContentType="name"
                            style={styles.input}
                            placeholder="Cardholder Name"
                            onChangeText={handleChange('cardName')}
                            onBlur={handleBlur('cardName')}
                            value={values.cardName}
                            autoComplete="cc-name"
                        />
                        {touched.cardName && errors.cardName && ( <Text style={styles.error}>{errors.cardName}</Text> )}

                        <TextInput
                            textContentType="none"
                            style={styles.input}
                            placeholder="MM/YY"
                            onChangeText={handleChange('exp')}
                            onBlur={handleBlur('exp')}
                            value={values.exp}
                            autoComplete="cc-exp"
                        />
                        {touched.exp && errors.exp && ( <Text style={styles.error}>{errors.exp}</Text>)}

                        <TextInput
                            textContentType="oneTimeCode"
                            style={styles.input}
                            placeholder="CVV"
                            keyboardType="number-pad"
                            onChangeText={handleChange('cvv')}
                            onBlur={handleBlur('cvv')}
                            value={values.cvv}
                            autoComplete="cc-csc"
                            secureTextEntry
                        />
                        {touched.cvv && errors.cvv && ( <Text style={styles.error}>{errors.cvv}</Text> )}

                        <TouchableOpacity onPress={handleSubmit as () => void} style={styles.button}>
                            <Text style={styles.buttonText}>Send payment</Text>
                        </TouchableOpacity>
                    </View>
                );
            }}
        </Formik>
    );
};

export default PaymentForm;

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: '#D55',
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#F05A7E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
