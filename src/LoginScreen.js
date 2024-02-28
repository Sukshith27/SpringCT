import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useFormik} from 'formik';
import {useState} from 'react';
import {TextInput, View, Alert, Text, Button} from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Required').email('Invalid Email'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async values => {
      try {
        setLoading(true);
        const response = await axios.post(`https://reqres.in/api/login`, {
          email: values.email,
          password: values.password,
        });
        console.log('response', response);
        if (response.status === 200) {
          await saveToken(response.data.token);
          navigation.navigate('Home');
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const saveToken = async token => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      console.log('Token saved successfully');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{paddingHorizontal: 20}}>
      <TextInput
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
      />
      {formik.errors.email && formik.touched.email && (
        <Text style={{color: 'red'}}>{formik.errors.email}</Text>
      )}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
      />
      {formik.errors.password && formik.touched.password && (
        <Text style={{color: 'red'}}>{formik.errors.password}</Text>
      )}
      <Button disabled={loading} title="Log In" onPress={formik.handleSubmit} />
    </View>
  );
};

export default LoginScreen;
