import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableRipple, Appbar} from 'react-native-paper';
import {getInfo} from '../api/user';
import Toast from 'react-native-toast-message';

export default function InformationScreen({navigation}) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const asyncGetInfo = async () => {
      try {
        const res = await getInfo();
        setData(res.data);
        console.log(data);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    asyncGetInfo();
  }, []);
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Thông tin cá nhân"
          // subtitle={`In ${route.params.farm.name}`}
        />
      </Appbar.Header>
      <View style={styles.container}>
        {data ? (
          <>
            <TouchableRipple
              style={styles.item}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={styles.itemRow}>
                <Text style={styles.title}>Tên</Text>
                <Text>{data.name}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={styles.item}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={styles.itemRow}>
                <Text style={styles.title}>Email</Text>
                <Text>{data.email}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={styles.item}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={styles.itemRow}>
                <Text style={styles.title}>Số điện thoại</Text>
                <Text>{data.phone}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={styles.item}
              rippleColor="rgba(0, 0, 0, .32)">
              <View style={styles.itemRow}>
                <Text style={styles.title}>Địa chỉ</Text>
                <Text>{data.address}</Text>
              </View>
            </TouchableRipple>
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 15,
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  item: {
    backgroundColor: '#dddddd',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
});
