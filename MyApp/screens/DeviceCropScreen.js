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

const paymentType = [
  {
    id: 0,
    name: 'Mời chọn kiểu thanh toán',
  },
  {
    id: 1,
    name: 'Thanh toán theo ngày',
  },
  {
    id: 2,
    name: 'Thanh toán theo mùa',
  },
];

export default function DeviceCropScreen({route, navigation}) {
  //form crop
  const [inputData, setInputData] = useState({
    cropName: null,
    description: null,
    ec: null,
    ph: null,
  });
  const [pickerSelected, setPickerSelected] = useState(0);
  const [typePlant, setTypePlant] = useState(null);
  const [pickerSelectedType, setPickerSelectedType] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });
  const [chooseDate, setChooseDate] = useState({
    start: null,
    end: null,
  });
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  //handle picker
  const showhideDatePicker = (type) => {
    //SHOW: type = 0: start, type = 1: end
    //HIDE: type = 2: start, type = 3: end
    console.log(isDatePickerVisible);
    if (type === 0)
      setDatePickerVisibility((preState) => {
        return {...preState, start: true};
      });
    if (type === 1)
      setDatePickerVisibility((preState) => {
        return {...preState, end: true};
      });
    if (type === 2)
      setDatePickerVisibility((preState) => {
        return {...preState, start: false};
      });
    if (type === 3)
      setDatePickerVisibility((preState) => {
        return {...preState, end: false};
      });
  };

  const handleConfirmStart = (date, type) => {
    console.log('A date has been picked: ', date, type);
    if (type === 2) {
      setChooseDate((preState) => {
        return {...preState, start: date.toISOString()};
      });
      if (typePlant) {
        var dateEnd = new Date();
        let dateStart = new Date(date);
        dateEnd.setDate(dateStart.getDate() + parseInt(typePlant.timeDays));
        console.log('dateStart', dateStart);
        console.log('typePlant.timeDays', typePlant.timeDays);
        console.log('dateEnd', dateEnd);
        setChooseDate((preState) => {
          return {...preState, end: dateEnd.toISOString()};
        });
      }
      showhideDatePicker(2);
    }
    if (type === 3) {
      setChooseDate((preState) => {
        return {...preState, end: date.toISOString()};
      });
      showhideDatePicker(3);
    }
    console.log('chooseDate', chooseDate);
  };
  const goBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    const data = {};
    data.cropName = inputData.cropName;
    data.description = inputData.description;
    data.paymentType = pickerSelectedType;
    data.plantId = pickerSelected;
    data.endTime = chooseDate.end;
    data.startTime = chooseDate.start;
    // ec: 0-5
    // ph : 0-14
    data.metaData = {
      ec: inputData.ec,
      ph: inputData.ph,
    };
    data.deviceIds = [route.params.device.id];
    console.log('@@data', data);
    try {
      const res = await cropDevice(data);
      const {error, message} = res;
      if (error == 1) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: message,
        });
      } else if (error == 0) {
        setCrop(true);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: message,
        });
        const device = route.params.device;
        navigation.navigate(STACK_FARMS.DEVICE_INFO, {device});
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo lỗi',
        text2: error.message,
      });
    }
  };

  const handleSubmitEnd = async () => {
    hideModal();
    console.log('handleSubmitEnd');
    try {
      const res = await stopCropDevice(route.params.device.id);
      const {error, message} = res;
      if (error == 1) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: 'Xảy ra lỗi! Vui lòng thử lại.',
        });
      } else if (error == 0) {
        navigation.navigate(STACK_FARMS.DEVICE_LIST);
        // setCrop(false);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Kết thúc vụ mùa thành công',
        });
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

  const [resData, setResData] = useState([]);
  const [crop, setCrop] = useState();
  useEffect(() => {
    console.log('refresh');
    const asyncFunc = async () => {
      const res = await getPlant(null, 1, 1, 1);
      const total = res.data.total;
      const allDataPlant = await getPlant(null, 1, total, 1);
      console.log('allDataPlant.data.items', allDataPlant.data.items);
      const arrItems = [];
      arrItems.push({
        name: 'Mời chọn loại cây trồng',
        id: 0,
      });
      arrItems.push(...allDataPlant.data.items);
      console.log('...allDataPlant.data.items', arrItems);

      setResData(arrItems);
      console.log('route.params.device.crop', route.params.device.alive);
      setCrop(route.params.device.alive);
      // setCrop(true);
      // if (route.params.device.crop) {
      //   setCrop(false);
      // } else {
      //   setCrop(true);
      // }
    };
    asyncFunc();
  }, []);
  const Header = (props) => (
    <View {...props}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Xác nhận</Text>
    </View>
  );
  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button mode="text" onPress={handleSubmitEnd}>
        Chấp nhận
      </Button>
      <Button mode="text" color="red" onPress={() => hideModal()}>
        Hủy bỏ
      </Button>
    </View>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Thiết lập mùa vụ"
          subtitle={`Thiết bị ${route.params.device.deviceName}`}
        />
      </Appbar.Header>
      {crop ? (
        <>
          {/* <Text style={styles.sectionHeaderStyle}>Kết thúc mùa vụ</Text> */}
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <Card style={styles.card} header={Header} footer={Footer}>
                <Text style={{fontSize: 15}}>
                  Bạn có chắc chắn muốn kết thúc?
                </Text>
              </Card>
            </Modal>
          </Portal>
          <View style={styles.center}>
            <Button
              mode="contained"
              color="#FCA902"
              style={commonStyles.styleBottomButton}
              onPress={() => showModal()}>
              Kết thúc mùa vụ
            </Button>
          </View>
        </>
      ) : (
        <>
          <ScrollView>
            <Text style={styles.sectionHeaderStyle}>Khởi tạo vụ</Text>
            <View style={styles.container}>
              <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
                <Text style={styles.title}>Tên mùa</Text>

                <TextInput
                  name="cropName"
                  value={inputData.cropName}
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setInputData((preState) => {
                      return {...preState, cropName: text};
                    });
                  }}
                  placeholder="Nhập tên vụ mùa"
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
              </View>
              <View style={styles.itemInput}>
                <Text style={styles.title}>Loại cây trồng</Text>

                <Picker
                  selectedValue={pickerSelected}
                  style={{
                    height: 50,
                    color:
                      pickerSelected !== 0
                        ? 'black'
                        : theme.colors.placeholderTextColor,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    setPickerSelected(itemValue);
                    resData.forEach((plant) => {
                      if (plant.id === itemValue) {
                        setTypePlant(plant);
                      }
                    });
                  }}>
                  {resData
                    ? resData.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.name}
                            value={item.id}
                            key={index}
                          />
                        );
                      })
                    : null}
                </Picker>
              </View>
              {pickerSelected !== 0 ? (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <View style={styles.twoColumn}>
                    <View
                      style={styles.itemInputColumn}
                      rippleColor="rgba(0, 0, 0, .32)">
                      <Text style={styles.title}>Giá trị EC</Text>

                      <TextInput
                        name="description"
                        value={inputData.ec}
                        style={styles.textInput}
                        onChangeText={(text) => {
                          setInputData((preState) => {
                            return {...preState, ec: text};
                          });
                        }}
                        placeholder={`Gợi ý ${
                          typePlant.description.split(',', 2)[0]
                        }`}
                        placeholderTextColor={theme.colors.placeholderTextColor}
                      />
                    </View>
                    <View
                      style={styles.itemInputColumn}
                      rippleColor="rgba(0, 0, 0, .32)">
                      <Text style={styles.title}>Giá trị PH</Text>

                      <TextInput
                        name="description"
                        value={inputData.ph}
                        style={styles.textInput}
                        onChangeText={(text) => {
                          setInputData((preState) => {
                            return {...preState, ph: text};
                          });
                        }}
                        placeholder={`Gợi ý ${
                          typePlant.description.split(',', 2)[1]
                        }`}
                        placeholderTextColor={theme.colors.placeholderTextColor}
                      />
                    </View>
                  </View>
                </Animatable.View>
              ) : null}
              <View style={styles.itemInput}>
                <Text style={styles.title}>Kiểu thanh toán</Text>

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
                          <Picker.Item
                            label={item.name}
                            value={item.id}
                            key={index}
                          />
                        );
                      })
                    : null}
                </Picker>
              </View>
              <View style={styles.twoColumn}>
                <View style={styles.itemInputColumn}>
                  <View>
                    <Text style={styles.title}>Ngày bắt đầu</Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => showhideDatePicker(0)}>
                      <TextInput
                        style={{
                          color: chooseDate.start
                            ? 'black'
                            : theme.colors.placeholderTextColor,
                        }}
                        value={
                          chooseDate.start == null
                            ? 'Chọn ngày bắt đầu'
                            : chooseDate.start.slice(0, 10)
                        }
                        editable={false}
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.start}
                      mode="date"
                      onConfirm={(date) => handleConfirmStart(date, 2)}
                      onCancel={() => showhideDatePicker(2)}
                    />
                  </View>
                </View>
                <View style={styles.itemInputColumn}>
                  <View>
                    <Text style={styles.title}>Ngày kết thúc</Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => showhideDatePicker(1)}>
                      <TextInput
                        style={{
                          color: chooseDate.start
                            ? 'black'
                            : theme.colors.placeholderTextColor,
                        }}
                        value={
                          chooseDate.end == null
                            ? 'Chọn ngày kết thúc'
                            : chooseDate.end.slice(0, 10)
                        }
                        editable={false}
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.end}
                      mode="date"
                      onConfirm={(date) => handleConfirmStart(date, 3)}
                      onCancel={() => showhideDatePicker(3)}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.item} rippleColor="rgba(0, 0, 0, .32)">
                <Text style={styles.title}>Mô tả</Text>

                <TextInput
                  name="description"
                  value={inputData.description}
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setInputData((preState) => {
                      return {...preState, description: text};
                    });
                    // console.log(text);
                  }}
                  placeholder="Nhập mô tả mùa vụ"
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
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
      )}
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
