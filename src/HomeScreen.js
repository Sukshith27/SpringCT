import React, {useCallback, useEffect, useState} from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const employeesJson = await AsyncStorage.getItem('employees');

      if (employeesJson !== null) {
        setEmployees(JSON.parse(employeesJson));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, []),
  );

  const renderItem = ({item}) => {
    return (
      <View
        style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <Text style={{fontSize: 18}}>{item.name}</Text>
        <Text>Age: {item.age}</Text>
        <Text>{item.address}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Button
        title="Add Employee"
        onPress={() => navigation.navigate('AddEmployee')}
      />
      <FlatList
        data={employees}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeScreen;
