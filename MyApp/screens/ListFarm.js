import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {Appbar, TouchableRipple} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getListFarm} from '../api/farm';
import {STACK_FARMS} from '../navigations/preset';
import {commonStyles, theme} from './../common/theme';
import Toast from 'react-native-toast-message';
var hash = require('object-hash');
export default function ListDeviceScreen({navigation}) {
  const [farms, setFarms] = useState([]);
  const [farmClass, setFarmClass] = useState({
    activate: [],
    inactivate: [],
    hash: false,
  });

  const classifyFarm = (farms) => {
    let activateFarm = [];
    let inactivateFarm = [];
    const hashValue = hash(farms);
    console.log('hash value', hashValue);
    farms.forEach((farm) => {
      if (farm.status === 1) {
        activateFarm.push(farm);
      }
      if (farm.status === 0) {
        inactivateFarm.push(farm);
      }
    });
    setFarmClass({
      activate: activateFarm,
      inactivate: inactivateFarm,
      hash: hashValue,
    });
  };
  React.useEffect(() => {
    const asyncGetFarms = async () => {
      try {
        console.log('@@@@error:::');
        let res = await getListFarm();
        const farmsData = res.data.farms;
        setFarms(farmsData);
        classifyFarm(farmsData);
      } catch (error) {
        console.log('error:::', error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    asyncGetFarms();
  }, []);
  useFocusEffect(() => {
    console.log('focus');
    getListFarm()
      .then((res) => {
        // console.log(res.data.farms);.
        // classifyFarm(res.data.farms);
        const hashValue = hash(res.data.farms);
        console.log(hashValue);
        if (farmClass.hash !== hashValue) {
          classifyFarm(res.data.farms);
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
  const handleFarm = (farm) => {
    navigation.navigate(STACK_FARMS.DEVICE_LIST, {
      farm,
    });
  };

  const Item = (props) => {
    const {name, address, description} = props.farm;
    return (
      <TouchableRipple
        style={commonStyles.item}
        onPress={() => {
          handleFarm(props.farm);
        }}
        rippleColor="rgba(0, 0, 0, .32)">
        <View>
          <Text style={commonStyles.title}>{name}</Text>
          <View style={commonStyles.row}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={theme.colors.primary}
              style={commonStyles.paddingIcon}
            />
            <Text>{address}</Text>
          </View>
          <View style={commonStyles.row}>
            <MaterialIcons
              name="notes"
              size={20}
              color={theme.colors.primary}
              style={commonStyles.paddingIcon}
            />
            <Text>{description}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };
  const renderItem = ({item}) => <Item farm={item} />;
  const FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={commonStyles.listItemSeparatorStyle} />
    );
  };
  const renderNoContent = ({section}) => {
    if (section.data.length == 0) {
      return (
        <Text>Không có vườn {section.title.toString().toLowerCase()}.</Text>
      );
    }
    return null;
  };
  return (
    <>
      <Appbar.Header style={commonStyles.top}>
        <Appbar.Content title="Danh sách vườn" />
      </Appbar.Header>
      <View style={commonStyles.container}>
        {farms.length === 0 ? (
          <>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
              <Text>Chưa tạo vườn</Text>
            </View>
          </>
        ) : (
          <>
            <SectionList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={FlatListItemSeparator}
              renderSectionFooter={renderNoContent}
              sections={[
                {title: 'Hoạt động', data: farmClass.activate},
                // {title: 'Chưa hoạt động', data: farmClass.inactivate},
              ]}
              renderSectionHeader={({section}) => (
                <Text style={commonStyles.sectionHeaderStyle}>
                  {section.title}
                </Text>
              )}
              renderItem={renderItem}
              keyExtractor={(farm) => farm.id.toString()}
            />
          </>
          // <Text>fdsafasd</Text
        )}
      </View>
    </>
  );
}
