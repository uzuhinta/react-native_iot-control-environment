import {
  View,
  Button,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';

import React from 'react';
import {AuthContext} from '../common/AuthContext';
import {TouchableRipple, Appbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {commonStyles, theme} from './../common/theme';
import {TABS_SETTING_KEY} from './../navigations/preset';

export default function SettingScreen({navigation}) {
  const {signOut} = React.useContext(AuthContext);
  const navigateChangePass = () => {
    navigation.push(TABS_SETTING_KEY.CHANGE_PASSWORD);
  };
  const navigateInformation = () => {
    navigation.push(TABS_SETTING_KEY.INFORMATION);
  };
  const navigateChangeInformation = () => {
    navigation.push(TABS_SETTING_KEY.CHANGE_INFORMATION);
  };

  return (
    <>
      <Appbar.Header style={commonStyles.top}>
        <Appbar.Content title="Cài đặt" />
      </Appbar.Header>
      <ScrollView style={commonStyles.container}>
        <TouchableRipple
          style={styles.item}
          onPress={navigateInformation}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <FontAwesome5
              name="user"
              size={32}
              style={[styles.icon, styles.modify]}
            />
            <Text style={styles.textSetting}>Thông tin cá nhân</Text>
            {/* <Text style={styles.data}>{data.waterTemp}</Text> */}
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={styles.item}
          onPress={navigateChangeInformation}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <FontAwesome5 name="user-edit" size={28} style={styles.icon} />
            <Text style={styles.textSetting}>Cài đặt tài khoản</Text>
            {/* <Text style={styles.data}>{data.waterTemp}</Text> */}
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={styles.item}
          onPress={navigateChangePass}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons
              name="form-textbox-password"
              size={36}
              style={styles.icon}
              onPress={navigateChangePass}
            />
            <Text style={styles.textSetting}>Thay đổi mật khẩu</Text>
            {/* <Text style={styles.data}>{data.waterTemp}</Text> */}
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={styles.item}
          onPress={() => {
            signOut();
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <MaterialCommunityIcons
              name="logout"
              size={36}
              style={styles.icon}
            />
            <Text style={styles.textSetting}>Đăng xuất</Text>
            {/* <Text style={styles.data}>{data.waterTemp}</Text> */}
          </View>
        </TouchableRipple>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    margin: 3,
  },
  text: {
    fontSize: 42,
  },
  item: {
    // backgroundColor: '#dddddd',
    padding: 15,
    paddingLeft: 15,
    // borderRadius: 10,
    // marginVertical: 8,
    // marginHorizontal: 2,
    borderBottomWidth: 1.5,
    borderBottomColor: '#bbbbbb',
  },
  textSetting: {
    marginLeft: 15,
    fontSize: 25,
  },
  modify: {
    paddingRight: 5,
  },
  icon: {
    color: theme.colors.primary,
  },
});
