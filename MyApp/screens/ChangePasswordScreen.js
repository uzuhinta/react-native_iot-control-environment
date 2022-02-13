import {Formik} from 'formik';
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, TextInput, Appbar} from 'react-native-paper';
import * as Yup from 'yup';
import {commonStyles, theme} from '../common/theme';
import {TABS_SETTING_KEY} from '../navigations/preset';
import {changePassword} from '../api/user';
import Toast from 'react-native-toast-message';
export default function ChangePasswordScreen({navigation}) {
  const changeHandle = async (values) => {
    console.log(values);
    try {
      const res = await changePassword({
        oldPass: values.oldPassword,
        newPass: values.newPassword,
        confirmPass: values.confirmPassword,
      });
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
  const SignInSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Hãy điền mật khẩu cũ'),
    newPassword: Yup.string()
      .required('Hãy điền mật khẩu mới')
      .test('len', 'Độ dài tối thiểu 6 ký tự', (val) => val?.length > 5),
    confirmPassword: Yup.string()
      .required('Hãy nhập lại mật khẩu mới')
      .test(
        'passwords-match',
        'Mật khẩu mới không trùng nhau',
        function (value) {
          return this.parent.newPassword === value;
        },
      ),
    // .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Đổi mật khẩu"
          // subtitle={`In ${route.params.farm.name}`}
        />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Formik
          validationSchema={SignInSchema}
          initialValues={{
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
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
              <Text style={styles.sectionHeaderStyle}>Mật khẩu hiện tại</Text>
              <TextInput
                name="oldPassword"
                label="Nhập mật khẩu hiện tại"
                onChangeText={handleChange('oldPassword')}
                onBlur={handleBlur('oldPassword')}
                value={values.oldPassword}
                style={styles.textInput}
                //   placeholder="Type your old password"
                placeholderTextColor={theme.colors.placeholderTextColor}
                secureTextEntry={true}
              />
              {errors.oldPassword && touched.oldPassword ? (
                <Text>
                  <Text style={styles.errorMsg}>{errors.oldPassword}</Text>
                </Text>
              ) : null}

              {/* Form password */}
              <Text style={styles.sectionHeaderStyle}>Mật khẩu mới</Text>

              <TextInput
                name="newPassword"
                label="Nhập mật khẩu mới"
                style={styles.textInput}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                value={values.newPassword}
                //   placeholder="Type your new password"
                placeholderTextColor={theme.colors.placeholderTextColor}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {errors.newPassword && touched.newPassword ? (
                <Text>
                  <Text style={styles.errorMsg}>{errors.newPassword}</Text>
                </Text>
              ) : null}
              <TextInput
                name="confirmPassword"
                style={styles.textInput}
                label="Nhập lại mật khẩu mới"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                //   placeholder="Confirm new password"
                placeholderTextColor={theme.colors.placeholderTextColor}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <Text>
                  <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
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
      </ScrollView>
    </>
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
