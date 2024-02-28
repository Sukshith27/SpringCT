import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {Logo} from '../src/utils/Images';

const window = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token'); // AsyncStorage token successfull
        console.log('Retrieved token:', token);
        if (token) {
          navigation.navigate('Home');
        } else {
          setTimeout(() => {
            navigation.navigate('Login'); // Navigate to Login if no Token
          }, 2000);
        }
      } catch (error) {
        console.error('Error retrieving the token', error);
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a67d6',
  },
  logo: {
    width: window.width * 0.5,
    height: window.width * 0.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 16,
    color: '#FFFFFF',
  },
});

export default SplashScreen;
