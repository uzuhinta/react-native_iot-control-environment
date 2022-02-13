import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
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
import RNPickerSelect from 'react-native-picker-select';
import {LineChart} from 'react-native-chart-kit';

const paymentType = [
  {
    id: 0,
    name: 'Nhiệt độ',
  },
  {
    id: 1,
    name: 'Độ ẩm',
  },
  {
    id: 2,
    name: 'Ánh sáng',
  },
];

export default function DeviceCropScreen({route, navigation}) {
  const [first, setFirst] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerSelectedType, setPickerSelectedType] = useState(0);
  const [day, setDay] = useState(new Date());
  const [res, setRes] = useState({});
  const [logs, setLogs] = useState([]);
  const [index, setIndex] = useState(0);
  const [humi, setHumi] = useState({
    12: 12,
  });
  const [temp, setTemp] = useState({
    12: 12,
  });
  const [light, setLight] = useState({
    12: 12,
  });

  const [topic, setTopic] = useState(
    'agriculture_hust_2021_control_topic_5b211e19-d4b3-4fa7-b096-e134796756ae',
  );

  useEffect(() => {
    database()
      .ref(`/${topic}/data`)
      .once('value')
      .then((snapshot) => {
        setRes(snapshot.val());
      });
  }, []);

  function timeConvert(n) {
    var num = n;
    var hours = num / 60 / 60;
    var rhours = Math.floor(hours);
    var minutes = (num - rhours * 3600) / 60;
    var rminutes = Math.round(minutes);
    return rhours + ':' + rminutes;
  }

  useEffect(() => {
    const getData = () => {
      console.log('hr', res);

      const iRes = res[day.toISOString().substring(0, 10)];
      if (iRes) {
        let temp = {};
        let humi = {};
        let light = {};
        Object.keys(iRes).map((item) => {
          temp[timeConvert(Math.round(parseInt(item)))] = Math.round(
            iRes[item].temp,
          );
          humi[timeConvert(Math.round(parseInt(item)))] = Math.round(
            iRes[item].humi,
          );
          light[timeConvert(Math.round(parseInt(item)))] = Math.round(
            iRes[item].light,
          );
        });
        setHumi(humi);
        setLight(light);
        setTemp(temp);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: 'Không có lịch sử dữ liệu',
        });
        // alert('Không có lịch sử dữ liệu');
        // setDay(new Date());
      }
    };
    getData();
  }, [day, pickerSelectedType]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (pickDate) => {
    setDay(pickDate);
    hideDatePicker();
  };
  // const []
  //form crop
  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    console.log('refresh', route.params.device);
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Lịch sử môi trường"
          subtitle={`Thiết bị ${route.params.device.deviceName}`}
        />
      </Appbar.Header>
      <ScrollView style={commonStyles.container}>
        <Text style={styles.sectionHeaderStyle}>Ngày</Text>

        {/* <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)"> */}
        <Button onPress={showDatePicker}>
          {day.toISOString().substring(0, 10)}
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {/* </View> */}

        <Text style={styles.sectionHeaderStyle}>Biểu đồ</Text>

        <Picker
          selectedValue={pickerSelectedType}
          style={{
            height: 50,
            color:
              pickerSelectedType !== 0
                ? 'black'
                : theme.colors.placeholderTextColor,
          }}
          onValueChange={(itemValue, itemIndex) => {
            setPickerSelectedType(itemValue);
          }}>
          {paymentType
            ? paymentType.map((item, index) => {
                return (
                  <Picker.Item label={item.name} value={item.id} key={index} />
                );
              })
            : null}
        </Picker>
        {pickerSelectedType == 0 && (
          <LineChart
            data={{
              labels: Object.keys(temp).map((key) => key.split(':')[0]),
              datasets: [
                {
                  data: Object.values(temp),
                },
              ],
            }}
            width={Dimensions.get('window').width - 16} // from react-native
            height={180}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
        {pickerSelectedType == 1 && (
          <LineChart
            data={{
              labels: Object.keys(humi).map((key) => key.split(':')[0]),
              datasets: [
                {
                  data: Object.values(humi),
                },
              ],
            }}
            width={Dimensions.get('window').width - 16} // from react-native
            height={180}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
        {pickerSelectedType == 2 && (
          <LineChart
            data={{
              labels: Object.keys(light).map((key) => key.split(':')[0]),
              datasets: [
                {
                  data: Object.values(light),
                },
              ],
            }}
            width={Dimensions.get('window').width - 16} // from react-native
            height={180}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
      </ScrollView>
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
