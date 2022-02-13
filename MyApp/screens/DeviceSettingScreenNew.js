import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Animatable from 'react-native-animatable';
import {Appbar, Button, Modal, Portal, Divider} from 'react-native-paper';
import {commonStyles, theme} from '../common/theme';
import {getPlant} from './../api/plant';
import {cropDevice, stopCropDevice} from './../api/device';
import Toast from 'react-native-toast-message';
import {ApplicationProvider, Layout, Card} from '@ui-kitten/components';
import {STACK_FARMS} from '../navigations/preset';
import database from '@react-native-firebase/database';

export default function DeviceCropScreen({route, navigation}) {
  const [device1, setDevice1] = useState(false);
  const [device2, setDevice2] = useState(false);
  const [mode, setMode] = useState(false);
  const [topic, setTopic] = useState(
    'agriculture_hust_2021_control_topic_5b211e19-d4b3-4fa7-b096-e134796756ae',
  );

  // useEffect(() => {
  //   console.log('route', route.params.device?.topicName);
  //   setTopic(route.params.device?.topicName);
  // }, []);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${topic}/response-device1`)
      .on('value', (snapshot) => {
        console.log('User data: ', snapshot.val());
        setDevice1(Boolean(snapshot.val()));
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
        setDevice2(Boolean(snapshot.val()));
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
        setMode(Boolean(snapshot.val()));
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/${topic}/response-mode`).off('value', onValueChange);
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    console.log('handleSubmit');
    if (mode) {
      database()
        .ref(`/${topic}/control-mode`)
        .set(mode ? 1 : 0)
        .then(() => console.log('Data set mode.'));
    } else {
      database()
        .ref(`/${topic}/control-device1`)
        .set(device1 ? 1 : 0)
        .then(() => console.log('Data set.'));
      database()
        .ref(`/${topic}/control-device2`)
        .set(device2 ? 1 : 0)
        .then(() => console.log('Data set.'));
      database()
        .ref(`/${topic}/control-mode`)
        .set(mode ? 1 : 0)
        .then(() => console.log('Data set mode.'));
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Điều khiển thiết bị"
          subtitle={`Thiết bị ${route.params.device.deviceName}`}
        />
      </Appbar.Header>
      <ScrollView style={commonStyles.container}>
        <Text style={styles.sectionHeaderStyle}>Cài đặt</Text>

        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Đèn sưởi</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                disabled={mode == 1}
                onValueChange={() => setDevice1((prev) => !prev)}
                value={device1}
              />
            </View>
          </View>
        </View>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Phun hơi </Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                disabled={mode == 1}
                onValueChange={() => setDevice2((prev) => !prev)}
                value={device2}
              />
            </View>
          </View>
        </View>
        <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.row}>
            <Text style={styles.title}>Chế độ tự động</Text>
            <View style={styles.compo}>
              {/* <Switch value={isSwitchOn} onValueChange={onToggleSwitch} /> */}
              <RNSwitch
                onValueChange={() => setMode((prev) => !prev)}
                value={mode}
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
  sectionHeaderStyle: {
    // backgroundColor: '#CDDC89',
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  paddingIcon: {
    paddingRight: 10,
  },
  textInput: {
    fontSize: 16,
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
  center: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerStyle: {
    // backgroundColor: 'white',
    width: '86%',
    marginLeft: '7%',
    height: 150,
    padding: 10,
    // borderRadius: 10,
    // alignItems: 'center',
  },
  twoColumn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInputColumn: {
    backgroundColor: '#dddddd',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '48%',
  },
});
