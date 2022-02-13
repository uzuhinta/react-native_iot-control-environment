import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Appbar, Button, TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getLastData} from '../api/device';
import {STACK_FARMS} from '../navigations/preset';

import {commonStyles, theme} from './../common/theme';
import Toast from 'react-native-toast-message';
export default function DeviceInfoScreen({route, navigation}) {
  const [data, setData] = useState({
    humidity: 0,
    temp: 0,
    light: 0,
    ec: 0,
    ph: 0,
    waterTemp: 0,
  });

  useEffect(() => {
    // console.log('route', route.params.device);
    let client;
    const handleMqtt = async () => {
      const deviceId = route.params.device.id;
      console.log('deviceId', deviceId);
      try {
        const topicName = await AsyncStorage.getItem('topicName');

        // console.log(client);
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          console.log('mqtt.event.error', msg);
        });

        client.on('message', function (msg) {
          let newData;
          try {
            newData = JSON.parse(msg.data);
            console.log('mqtt.event.message', newData);
            if (newData.token == deviceId && newData.type == 2) {
              if (newData.data) {
                console.log('setdata');
                setData({
                  ...data,
                  ...newData.data,
                });
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'Thông báo',
                  text2:
                    'Thiết bị của bạn không hoạt động! Vui lòng kiểm tra lại.',
                });
              }
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Thông báo lỗi',
              text2: 'Thiết bị lỗi! Vui lòng liên hệ quản trị viên.',
            });
          }
          // {"token":"7","type":1,"data":null,"description":"Thiết bị của bạn không hoạt động ! Vui lòng kiểm tra lại !"}
        });

        client.on('connect', function () {
          console.log('connected');
          console.log(topicName);
          client.subscribe(topicName, 0);
          // client.publish('/data', 'test', 0, false);
        });

        client.connect();
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
      try {
        const res = await getLastData(deviceId);
        const dataRes = res.data?.data?.data;
        console.log('@@', dataRes);
        if (dataRes != null) {
          setData(dataRes);
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    handleMqtt();
    return () => {
      client.disconnect();
      console.log('disconnect client');
    };
  }, []);
  const goBack = () => {
    navigation.navigate(STACK_FARMS.DEVICE_LIST);
  };
  // {"humidity":"80","temp":"18.5","light":"1080","ec":"0.92","ph":"5.08","waterTemp":"22.18"}
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
        {data === null ? (
          <Text>Chưa có thông tin</Text>
        ) : (
          <>
            <Text style={styles.sectionHeaderStyle}>Tổng quan</Text>
            <TouchableRipple
              style={commonStyles.item}
              onPress={() => {
                console.log('test');
              }}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={commonStyles.itemRow}>
                <MaterialCommunityIcons name="temperature-celsius" size={40} />
                <Text style={styles.description}>Nhiệt độ</Text>
                <Text style={styles.data}>{data.temp}</Text>
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
                <Text style={styles.data}>{data.humidity}</Text>
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
                <Text style={styles.description}>Độ sáng</Text>
                <Text style={styles.data}>{data.light}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={commonStyles.item}
              onPress={() => {
                console.log('test');
              }}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={commonStyles.itemRow}>
                <MaterialCommunityIcons name="water-percent" size={40} />
                <Text style={styles.description}>Độ EC</Text>
                <Text style={styles.data}>{data.ec}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={commonStyles.item}
              onPress={() => {
                console.log('test');
              }}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={commonStyles.itemRow}>
                <MaterialCommunityIcons name="water" size={40} />
                <Text style={styles.description}>Độ PH</Text>
                <Text style={styles.data}>{data.ph}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={commonStyles.item}
              onPress={() => {
                console.log('test');
              }}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={commonStyles.itemRow}>
                <MaterialCommunityIcons name="coolant-temperature" size={40} />
                <Text style={styles.description}>Nhiệt độ nước</Text>
                <Text style={styles.data}>{data.waterTemp}</Text>
              </View>
            </TouchableRipple>
          </>
        )}
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
