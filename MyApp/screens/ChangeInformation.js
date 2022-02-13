import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput, Appbar} from 'react-native-paper';
import * as Yup from 'yup';
import {commonStyles, theme} from '../common/theme';
import {TABS_SETTING_KEY} from '../navigations/preset';
import {changeInfo} from '../api/user';
import Toast from 'react-native-toast-message';
import {getInfo} from '../api/user';

export default function ChangePasswordScreen({navigation}) {
  const [data, setData] = useState({});
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const asyncGetInfo = async () => {
      try {
        const res = await getInfo();
        console.log(res.data);
        setInfo(res.data);
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

  const changeHandle = async (values) => {
    console.log(values);
    try {
      const res = await changeInfo({...values, id: info?.ID});
      const {message, error, data} = res;
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
        navigation.navigate(TABS_SETTING_KEY.SETTING);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo lỗi',
        text2: error.message,
      });
    }
  };
  const ChangeInfoSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    phone: Yup.string(),
    address: Yup.string(),
  });
  const goBack = () => {
    navigation.goBack();
  };
  return (
    info && (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content
            title="Thay đổi thông tin cá nhân"
            // subtitle={`In ${route.params.farm.name}`}
          />
        </Appbar.Header>
        <View style={styles.container}>
          <Formik
            validationSchema={ChangeInfoSchema}
            initialValues={{
              name: info.name,
              email: info.email,
              phone: info.phone,
              address: info.address,
            }}
            onSubmit={changeHandle}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
            }) => (
              <>
                {/* <Text style={styles.sectionHeaderStyle}>Old password</Text> */}
                <TextInput
                  name="name"
                  label="Tên"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  style={styles.textInput}
                  placeholder={info.name}
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
                {errors.name && touched.name ? (
                  <Text>
                    <Text style={styles.errorMsg}>{errors.name}</Text>
                  </Text>
                ) : null}

                {/* Form password */}
                {/* <Text style={styles.sectionHeaderStyle}>New password</Text> */}

                <TextInput
                  name=""
                  label="Email"
                  style={styles.textInput}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder={info.email}
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
                {errors.email && touched.email ? (
                  <Text>
                    <Text style={styles.errorMsg}>{errors.email}</Text>
                  </Text>
                ) : null}
                <TextInput
                  name="phone"
                  style={styles.textInput}
                  label="Số điện thoại"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  placeholder={info.phone}
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
                {errors.phone && touched.phone ? (
                  <Text>
                    <Text style={styles.errorMsg}>{errors.phone}</Text>
                  </Text>
                ) : null}
                <TextInput
                  name="address"
                  style={styles.textInput}
                  label="Địa chỉ"
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  placeholder={info.address}
                  placeholderTextColor={theme.colors.placeholderTextColor}
                />
                {errors.address && touched.address ? (
                  <Text>
                    <Text style={styles.errorMsg}>{errors.address}</Text>
                  </Text>
                ) : null}
                <View style={[commonStyles.bottomButton]}>
                  <Button
                    mode="contained"
                    style={styles.signIn}
                    onPress={handleSubmit}
                    disabled={!isValid}>
                    Lưu thay đổi
                  </Button>
                  {/* <Button title="Change password" /> */}
                </View>
              </>
            )}
          </Formik>
        </View>
      </>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    margin: 5,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeaderStyle: {
    // backgroundColor: '#CDDC89',
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
  },

  textInput: {
    marginTop: 5,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  signIn: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
