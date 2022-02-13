import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
  Text,
  View,
} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {commonStyles, theme} from '../common/theme';
import {controlDevice} from './../api/device';
import AsyncStorage from '@react-native-community/async-storage';
import MQTT from 'react-native-mqtt-angelos3lex';
import {getLastStateDevice} from '../api/device';

const convertBool = (value) => {
  if (value) {
    return 0;
  }
  return 1;
};
const convertIntToBool = (value) => {
  if (value == 0) {
    return true;
  }
  return false;
};

export default function DeviceInfoScreenNew({route, navigation}) {
  const [device, setDevice] = useState();
  const [controlPump, setControlPump] = useState(false);
  const [controlFan, setControlFant] = useState(false);
  const [controlAirHumidifier, setControlAirHumidifier] = useState(false);
  const [controlSun, setControlSun] = useState(false);
  const toggleSwitch = (name) => {
    switch (name) {
      case 'pump':
        setControlPump((previous) => !previous);
        break;
      case 'fan':
        setControlFant((previous) => !previous);
        break;
      case 'air_humidifier':
        setControlAirHumidifier((previous) => !previous);
        break;
      case 'sun':
        setControlSun((previous) => !previous);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const device = route.params.device;
    setDevice(device);
    let client;
    const handleMqtt = async () => {
      const deviceId = route.params.device.id;
      try {
        const topicName = await AsyncStorage.getItem('topicName');
        client = await MQTT.createClient({
          uri: 'mqtt://broker.hivemq.com:1883',
          clientId: 'your_client_id',
        });
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
            // console.log(newData);
            console.log('mqtt.event.message', newData);
            console.log('mqtt.event.deviceIs', deviceId);
            if (newData.token == deviceId && newData.type == 1) {
              if (newData.data) {
                const {sun, fan, pump, air_humidifier} = newData.data;
                console.log(
                  'sun, fan, pump, air_humidifier',
                  sun,
                  fan,
                  pump,
                  air_humidifier,
                );
                setControlSun(sun === 1 ? true : false);
                setControlFant(fan === 1 ? true : false);
                setControlPump(pump === 1 ? true : false);
                setControlAirHumidifier(air_humidifier === 1 ? true : false);
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
      const res = await getLastStateDevice(deviceId);
      const data = res?.data?.data?.data;
      //  {"air_humidifier": 0, "cachedTime": 1618047948624, "fan": 0, "pump": 1, "sun": 0}
      if (data) {
        setControlFant(convertIntToBool(data.fan));
        setControlPump(convertIntToBool(data.pump));
        setControlSun(convertIntToBool(data.sun));
        setControlAirHumidifier(convertIntToBool(data.air_humidifier));
      }
    };
    handleMqtt();
    return () => {
      client.disconnect();
      console.log('disconnect client');
    };
  }, []);
  const goBack = () => {
    navigation.goBack();
  };
  const handleSubmit = async () => {
    const formInput = {};
    const data = {};
    formInput['type'] = 1;
    formInput['description'] = device.description;
    formInput['token'] = device.id;
    data['pump'] = convertBool(controlPump);
    data['fan'] = convertBool(controlFan);
    data['air_humidifier'] = convertBool(controlAirHumidifier);
    data['sun'] = convertBool(controlSun);
    formInput['data'] = data;
    console.log(formInput);
    try {
      const res = await controlDevice(formInput);
      const {message, error} = res;
      if (error == 1) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: message,
        });
      } else if (error == 0) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: message,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo lỗi',
        text2: error,
      });
    }
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
        <Text style={styles.sectionHeaderStyle}>Cài đặt</Text>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Máy bơm lên giàn</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                onValueChange={() => toggleSwitch('pump')}
                value={controlPump}
              />
            </View>
          </View>
        </View>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Quạt</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                onValueChange={() => toggleSwitch('fan')}
                value={controlFan}
              />
            </View>
          </View>
        </View>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Phun sương</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                onValueChange={() => toggleSwitch('air_humidifier')}
                value={controlAirHumidifier}
              />
            </View>
          </View>
        </View>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Cắt nắng</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                onValueChange={() => toggleSwitch('sun')}
                value={controlSun}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={commonStyles.bottomButton}>
        <Button
          mode="contained"
          style={commonStyles.styleBottomButton}
          onPress={handleSubmit}>
          Thiết lập
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
