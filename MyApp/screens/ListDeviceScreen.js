import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View, SectionList} from 'react-native';
import {TouchableRipple, Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {getListDevice} from '../api/device';
import {STACK_FARMS} from '../navigations/preset';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-paper';
import {List} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {commonStyles, theme} from './../common/theme';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
var hash = require('object-hash');

export default function ListDeviceScreen({route, navigation}) {
  const [devices, setDevices] = useState([]);
  const [deviceClass, setDeviceClass] = useState({
    activate: [],
    inactivate: [],
    hash: false,
  });
  const classifyDevices = (devices) => {
    let activate = [];
    let inactivate = [];
    const hashValue = hash(devices);
    devices.forEach((device) => {
      if (device.alive == true) {
        activate.push(device);
      }
      if (device.alive == false) {
        inactivate.push(device);
      }
      setDeviceClass({
        activate: activate,
        inactivate: inactivate,
        hash: hashValue,
      });
      // console.log(deviceClass);
    });
  };
  React.useEffect(() => {
    const asyncGetDevices = async () => {
      try {
        const farmId = route.params.farm.id;
        console.log(route.params.farm.name);
        let res = await getListDevice(farmId);
        const devicesData = res.data.devices;
        setDevices(devicesData);
        classifyDevices(devicesData);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    asyncGetDevices();
  }, []);

  useFocusEffect(() => {
    console.log('focus');
    const farmId = route.params.farm.id;
    getListDevice(farmId)
      .then((res) => {
        // console.log(res.data.farms);.
        // classifyFarm(res.data.farms);
        const hashValue = hash(res.data.devices);
        console.log(res.data.devices);
        if (deviceClass.hash !== hashValue) {
          console.log('@@@ has device change');
          classifyDevices(res.data.devices);
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      });
  });

  const handleFarmInfo = (device) => {
    // const {alive} = device;
    // if (alive) {
    navigation.navigate(STACK_FARMS.DEVICE_INFO, {
      device,
    });
    // } else {
    //   Toast.show({
    //     type: 'info',
    //     text1: 'Thông tin',
    //     text2: 'Thiết bị của bạn không hoạt động ! Vui lòng kiểm tra lại !',
    //   });
    // }
  };
  const handleFarmCrop = (device) => {
    console.log(device);
    navigation.navigate(STACK_FARMS.DEVICE_CROP, {
      device,
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const Item = (props) => {
    const {deviceName, alive, description} = props.device;
    // console.log('trang thai', alive);
    return (
      <TouchableRipple
        style={styles.item}
        onPress={() => {
          handleFarmInfo(props.device);
        }}
        rippleColor="rgba(0, 0, 0, .32)">
        <View style={[commonStyles.itemRow, styles.justifySpaceBetween]}>
          <View>
            <Text style={styles.title}>{deviceName}</Text>
            <View style={styles.row}>
              <MaterialIcons
                name="notes"
                size={20}
                color={theme.colors.primary}
                style={styles.paddingIcon}
              />
              <Text>{description}</Text>
            </View>

            {/* <Text>{alive ? 'Running' : 'Stopped'}</Text> */}
          </View>
          <Button
            mode="text"
            onPress={() => {
              handleFarmCrop(props.device, alive);
            }}>
            <AntDesign name="infocirlceo" size={35} />
          </Button>
        </View>
      </TouchableRipple>
    );
  };
  const renderItem = ({item}) => <Item device={item} />;
  const FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={styles.listItemSeparatorStyle} />
    );
  };

  const renderNoContent = ({section}) => {
    if (section.data.length == 0) {
      return (
        <Text>Không có thiết bị {section.title.toString().toLowerCase()}.</Text>
      );
    }
    return null;
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Danh sách thiết bị"
          subtitle={`Vườn ${route.params.farm.name}`}
        />
      </Appbar.Header>
      <View style={styles.container}>
        {devices.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
            <Text>Chưa có thiết bị trong vườn</Text>
          </View>
        ) : (
          <SectionList
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={FlatListItemSeparator}
            sections={[
              {title: 'Hoạt động', data: deviceClass.inactivate},
              // {title: 'Chưa hoạt động', data: deviceClass.inactivate},
            ]}
            renderSectionHeader={({section}) => (
              <Text style={styles.sectionHeaderStyle}>{section.title}</Text>
            )}
            renderSectionFooter={renderNoContent}
            renderItem={renderItem}
            keyExtractor={(device) => device.id.toString()}
          />
        )}
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
  title: {
    fontSize: 22,
  },

  row: {
    display: 'flex',
    paddingTop: 5,
    flexDirection: 'row',
  },
  paddingIcon: {
    paddingRight: 10,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    // backgroundColor: 'white',
  },
  sectionHeaderStyle: {
    // backgroundColor: '#CDDC89',
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
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
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
});
