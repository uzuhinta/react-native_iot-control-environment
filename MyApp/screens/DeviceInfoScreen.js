import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Appbar, Button, TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getLastData} from '../api/device';
import {STACK_FARMS} from '../navigations/preset';

import {commonStyles, theme} from './../common/theme';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';

const convertNodeToJSON = (data) => {
  const temp = JSON.stringify(data).split(/^{.*{/)[1];
  return JSON.parse('{' + temp.substring(0, temp.length - 1));
};

export default function DeviceInfoScreen({route, navigation}) {
  const [temp, setTemp] = useState(0);
  const [humi, setHumi] = useState(0);
  const [light, setLight] = useState(0);
  const [device1, setDevice1] = useState(0);
  const [device2, setDevice2] = useState(0);
  const [mode, setMode] = useState(0);
  const [topic, setTopic] = useState(
    'agriculture_hust_2021_control_topic_5b211e19-d4b3-4fa7-b096-e134796756ae',
  );

  // useEffect(() => {
  //   console.log('route', route.params.device?.topicName);
  //   setTopic(route.params.device?.topicName);
  // }, []);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${topic}/data/${new Date().toISOString().substring(0, 10)}`)
      .limitToLast(1)
      .on('value', (snapshot) => {
        // console.log('User data: ', convertNodeToJSON(snapshot.val()));
        const data = convertNodeToJSON(snapshot.val());
        setHumi(data?.humi);
        setLight(data?.light);
        setTemp(data?.temp);
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${topic}/data`).off('value', onValueChange);
  }, []);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${topic}/response-device1`)
      .on('value', (snapshot) => {
        console.log('User data: ', snapshot.val());
        setDevice1(snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/${topic}/response-device1`).off('value', onValueChange);
  }, []);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${topic}/response-device2`)
      .on('value', (snapshot) => {
        console.log('User data: ', snapshot.val());
        setDevice2(snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/${topic}/response-device2`).off('value', onValueChange);
  }, []);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${topic}/response-mode`)
      .on('value', (snapshot) => {
        console.log('User data: ', snapshot.val());
        setMode(snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/${topic}/response-mode`).off('value', onValueChange);
  }, []);

  const goBack = () => {
    navigation.navigate(STACK_FARMS.DEVICE_LIST);
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Thiết bị"
          subtitle={`${route.params.device.deviceName}`}
        />
      </Appbar.Header>
      <ScrollView style={commonStyles.container}>
        <Text style={styles.sectionHeaderStyle}>Môi trường</Text>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="coolant-temperature" size={40} />
            <Text style={styles.description}>Nhiệt độ</Text>
            <Text style={styles.data}>{temp}</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="air-humidifier" size={40} />
            <Text style={styles.description}>Độ ẩm</Text>
            <Text style={styles.data}>{humi}</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="white-balance-sunny" size={40} />
            <Text style={styles.description}>Ánh sáng</Text>
            <Text style={styles.data}>{light}</Text>
          </View>
        </TouchableRipple>
        <Text style={styles.sectionHeaderStyle}>Thiết bị</Text>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="white-balance-sunny" size={40} />
            <Text style={styles.description}>Đèn sưởi</Text>
            <Text style={styles.data}>{device1 == 0 ? 'OFF' : 'ON'}</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="air-humidifier" size={40} />
            <Text style={styles.description}>Độ ẩm</Text>
            <Text style={styles.data}>{device2 == 0 ? 'OFF' : 'ON'}</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          onPress={() => {
            console.log('test');
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons name="robot" size={40} />
            <Text style={styles.description}>Chế độ tự động</Text>
            <Text style={styles.data}>{mode == 0 ? 'OFF' : 'ON'}</Text>
          </View>
        </TouchableRipple>
      </ScrollView>
      <View style={commonStyles.bottomButton}>
        <Button
          mode="contained"
          style={styles.signIn}
          onPress={() => {
            const device = route.params.device;
            navigation.navigate(STACK_FARMS.DEVICE_SETTING, {device});
            console.log(device);
          }}>
          Điều khiển thiết bị
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  description: {
    marginLeft: 15,
    fontSize: 25,
    maxWidth: '60%',
  },
  sectionHeaderStyle: {
    // backgroundColor: '#CDDC89',
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  data: {
    color: theme.colors.primary,
    fontSize: 30,
    position: 'absolute',
    right: '5%',
  },
  item: {
    backgroundColor: '#dddddd',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  itemInput: {
    backgroundColor: '#dddddd',
    padding: 5,
    paddingLeft: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
  },
  row: {
    display: 'flex',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signIn: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  paddingIcon: {
    paddingRight: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionListItemStyle: {
    fontSize: 15,
    padding: 15,
    color: '#000',
    backgroundColor: '#F5F5F5',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '80%',
    marginLeft: '10%',
    backgroundColor: '#C8C8C8',
  },
});
