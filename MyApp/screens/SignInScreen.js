import {Formik} from 'formik';
import React, {createRef, useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';
import {AuthContext} from '../common/AuthContext';
import {theme} from '../common/theme';
import {SCREENS_KEY} from './../navigations/preset';

const SignInScreen = ({navigation}) => {
  const [data, setData] = useState({
    secureTextEntry: true,
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    // console.log(colors);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setData({
      ...data,
      isKeyboardShow: true,
    });
  };

  const _keyboardDidHide = () => {
    setData({
      ...data,
      isKeyboardShow: false,
    });
  };

  const {colors} = useTheme();

  const {signIn} = React.useContext(AuthContext);

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const signinHandle = (values) => {
    console.log(values);
    signIn({username: values.username, password: values.password});
  };

  const SignInSchema = Yup.object().shape({
    username: Yup.string().required('Hãy điền tên đăng nhập'),
    password: Yup.string().required('Hãy điền mật khẩu'),
  });

  const refInput = createRef();

  return (
    <View style={styles.container}>
      {/* <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      /> */}
      <View style={styles.header}>
        <Text style={styles.text_header}>Xin chào!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: colors.background,
            flex: data.isKeyboardShow ? 10 : 3,
          },
        ]}>
        <Formik
          validationSchema={SignInSchema}
          initialValues={{username: 'quannar1781', password: '123456'}}
          onSubmit={signinHandle}>
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
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: colors.text,
                  },
                ]}>
                Tên đăng nhập
              </Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color={colors.text} size={20} />
                <TextInput
                  name="username"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholder="Điền tên đăng nhập"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    console.log(refInput.current.focus());
                  }}
                  placeholderTextColor={theme.colors.placeholderTextColor}
                  style={[
                    styles.textInput,
                    {
                      color: colors.text,
                    },
                  ]}
                />
              </View>
              {errors.username && touched.username ? (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.username}</Text>
                </Animatable.View>
              ) : null}

              {/* Form password */}
              <Text
                style={[
                  styles.text_footer,
                  {
                    color: colors.text,
                    marginTop: 35,
                  },
                ]}>
                Mật khẩu
              </Text>
              <View style={styles.action}>
                <Feather name="lock" color={colors.text} size={20} />
                <TextInput
                  name="password"
                  // style={styles.textInput}
                  onChangeText={handleChange('password')}
                  ref={refInput}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Điền mật khẩu"
                  placeholderTextColor="#666666"
                  onSubmitEditing={handleSubmit}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={[
                    styles.textInput,
                    {
                      color: colors.text,
                    },
                  ]}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && touched.password ? (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.password}</Text>
                </Animatable.View>
              ) : null}
              {/* <TouchableOpacity>
                <Text style={{color: theme.colors.primary, marginTop: 15}}>
                  Forgot password?
                </Text>
              </TouchableOpacity> */}
              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={handleSubmit}
                  disabled={!isValid}>
                  <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      Đăng nhập
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate(SCREENS_KEY.SIGNUP)}
                  style={[
                    styles.signIn,
                    {
                      borderColor: theme.colors.primary,
                      borderWidth: 1,
                      marginTop: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: theme.colors.primary,
                      },
                    ]}>
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
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
