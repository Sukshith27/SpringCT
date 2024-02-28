import React from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number().required('Age is required').positive().integer(),
  address: Yup.string().required('Address is required'),
});

const AddEmployeeScreen = () => {
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: {name: '', age: '', address: ''},
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        const newEmployee = {...values, id: Date.now()};
        const storedEmployees = await AsyncStorage.getItem('employees');
        const employees = storedEmployees ? JSON.parse(storedEmployees) : [];
        employees.push(newEmployee);
        await AsyncStorage.setItem('employees', JSON.stringify(employees));
        Alert.alert('Employee Added', 'Employee has been added successfully!');
        resetForm();
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Failed to add the employee.');
      }
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name && (
        <Text style={styles.errorText}>{formik.errors.name}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Age"
        onChangeText={formik.handleChange('age')}
        onBlur={formik.handleBlur('age')}
        value={formik.values.age}
        keyboardType="numeric"
      />
      {formik.touched.age && formik.errors.age && (
        <Text style={styles.errorText}>{formik.errors.age}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Address"
        onChangeText={formik.handleChange('address')}
        onBlur={formik.handleBlur('address')}
        value={formik.values.address}
      />
      {formik.touched.address && formik.errors.address && (
        <Text style={styles.errorText}>{formik.errors.address}</Text>
      )}
      <Button title="Add Employee" onPress={formik.handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default AddEmployeeScreen;
