import {Formik} from 'formik';
import React, {useEffect, useState, createRef} from 'react';
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
import {signup} from '../api/auth';
import {theme} from '../common/theme';
import {SCREENS_KEY} from './../navigations/preset';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({navigation}) => {
  const [data, setData] = useState({
    isKeyboardShow: false,
  });

  const [secure, setSecure] = useState({
    secureTextEntryFirst: true,
    secureTextEntrySecond: true,
  });

  const [firstData, setFirstData] = useState({});

  const [first, setFirst] = useState(true);

  useEffect(() => {
    console.log(first);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    // console.log(colors);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
      console.log('return', first);
    };
  }, []);

  const _keyboardDidShow = () => {
    console.log(first);
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
    console.log(first);
  };

  const {colors} = useTheme();

  const FirstSignUpSchema = Yup.object().shape({
    fullName: Yup.string().required('Hãy điền họ và tên'),
    phoneNumber: Yup.string().required('Hãy điền số điện thoại'),
    address: Yup.string().required('Hãy điền địa chỉ'),
    email: Yup.string()
      .required('Hãy điền email')
      .email('Vui lòng xem lại email'),
  });
  const SecondSignUpSchema = Yup.object().shape({
    username: Yup.string().required('Hãy điền tên đăng nhập'),
    password: Yup.string()
      .required('Hãy điền mật khẩu')
      .test('len', 'Độ dài tối thiểu 6 ký tự', (val) => val?.length > 5),
    repassword: Yup.string()
      .required('Hãy điền lại mật khẩu')
      .test(
        'passwords-match',
        'Các mật khẩu đã nhập không khớp. Hãy thử lại.',
        function (value) {
          return this.parent.password === value;
        },
      ),
  });

  const firstSubmit = (values) => {
    setFirst(false);
    console.log(values);
    setFirstData(values);
  };

  const handleSignUp = async (values) => {
    const formData = {
      ...values,
      ...firstData,
    };
    try {
      const res = await signup(formData);
      console.log(res);
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
        navigation.navigate(SCREENS_KEY.SIGNIN);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo lỗi',
        text2: error.message,
      });
    }
  };

  const phoneNumberRef = createRef();
  const addressRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const repasswordRef = createRef();

  return (
    <View style={styles.container}>
      {first === true ? (
        <>
          <View style={styles.header}>
            <Text style={styles.text_header}>Đăng ký tài khoản</Text>
          </View>
          <Animatable.View
            animation="fadeInUpBig"
            style={[
              styles.footer,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: colors.background,
                flex: data.isKeyboardShow ? 9 : 2,
              },
            ]}>
            <Formik
              key="1"
              validationSchema={FirstSignUpSchema}
              initialValues={{
                fullName: '',
                phoneNumber: '',
                address: '',
                email: '',
              }}
              onSubmit={firstSubmit}>
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
                  <View style={styles.action}>
                    <FontAwesome
                      name="user"
                      style={{width: 23}}
                      color={colors.text}
                      size={20}
                    />
                    <TextInput
                      name="fullName"
                      placeholder="Họ và tên"
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        phoneNumberRef.current.focus();
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
                  {errors.fullName && touched.fullName ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.fullName}</Text>
                    </Animatable.View>
                  ) : null}
                  <View style={styles.action}>
                    <FontAwesome
                      style={{width: 23}}
                      name="phone"
                      color={colors.text}
                      size={25}
                    />
                    <TextInput
                      name="phoneNumber"
                      placeholder="Số điện thoại"
                      keyboardType="phone-pad"
                      ref={phoneNumberRef}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        addressRef.current.focus();
                      }}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                      placeholderTextColor={theme.colors.placeholderTextColor}
                      style={[
                        styles.textInput,
                        {
                          color: colors.text,
                        },
                      ]}
                    />
                  </View>
                  {errors.phoneNumber && touched.phoneNumber ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.phoneNumber}</Text>
                    </Animatable.View>
                  ) : null}
                  <View style={styles.action}>
                    <FontAwesome
                      style={{width: 23}}
                      name="compass"
                      color={colors.text}
                      size={25}
                    />

                    <TextInput
                      name="address"
                      placeholder="Địa chỉ"
                      ref={addressRef}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        console.log(emailRef.current.focus());
                      }}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      placeholderTextColor={theme.colors.placeholderTextColor}
                      style={[
                        styles.textInput,
                        {
                          color: colors.text,
                        },
                      ]}
                    />
                  </View>
                  {errors.address && touched.address ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.address}</Text>
                    </Animatable.View>
                  ) : null}

                  <View style={styles.action}>
                    <FontAwesome
                      name="envelope"
                      style={{width: 23}}
                      color={colors.text}
                      size={20}
                    />

                    <TextInput
                      name="email"
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      ref={emailRef}
                      returnKeyType="next"
                      onSubmitEditing={handleSubmit}
                      placeholderTextColor={theme.colors.placeholderTextColor}
                      style={[
                        styles.textInput,
                        {
                          color: colors.text,
                        },
                      ]}
                    />
                  </View>
                  {errors.email && touched.email ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.email}</Text>
                    </Animatable.View>
                  ) : null}

                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.signIn}
                      disabled={!isValid}
                      onPress={handleSubmit}>
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
                          Tiếp theo
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate(SCREENS_KEY.SIGNIN)}
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
                        Đăng nhập
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </Animatable.View>
        </>
      ) : (
        <>
          <Animatable.View animation="fadeInRight" style={styles.header}>
            <Text style={styles.text_header}>Đăng ký tài khoản</Text>
          </Animatable.View>

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
              key="2"
              validationSchema={SecondSignUpSchema}
              initialValues={{
                username: '',
                password: '',
                repassword: '',
              }}
              onSubmit={handleSignUp}>
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
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={20} />
                    <TextInput
                      name="username"
                      placeholder="Điền tên đăng nhập"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        passwordRef.current.focus();
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
                  <View style={styles.action}>
                    <Feather name="lock" color={colors.text} size={20} />
                    <TextInput
                      name="password"
                      placeholder="Điền mật khẩu"
                      onChangeText={handleChange('password')}
                      ref={passwordRef}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        addressRef.current.focus();
                      }}
                      secureTextEntry={secure.secureTextEntryFirst}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholderTextColor={theme.colors.placeholderTextColor}
                      style={[
                        styles.textInput,
                        {
                          color: colors.text,
                        },
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setSecure((preState) => {
                          return {
                            ...preState,
                            secureTextEntryFirst: !preState.secureTextEntryFirst,
                          };
                        })
                      }>
                      {secure.secureTextEntryFirst ? (
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
                  <View style={styles.action}>
                    <Feather name="lock" color={colors.text} size={20} />
                    <TextInput
                      name="repassword"
                      placeholder="Xác nhận mật khẩu"
                      onChangeText={handleChange('repassword')}
                      onBlur={handleBlur('repassword')}
                      ref={repasswordRef}
                      secureTextEntry={secure.secureTextEntrySecond}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      value={values.repassword}
                      placeholderTextColor={theme.colors.placeholderTextColor}
                      style={[
                        styles.textInput,
                        {
                          color: colors.text,
                        },
                      ]}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setSecure((preState) => {
                          return {
                            ...preState,
                            secureTextEntrySecond: !preState.secureTextEntrySecond,
                          };
                        })
                      }>
                      {secure.secureTextEntrySecond ? (
                        <Feather name="eye-off" color="grey" size={20} />
                      ) : (
                        <Feather name="eye" color="grey" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.repassword && touched.repassword ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.repassword}</Text>
                    </Animatable.View>
                  ) : null}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.signIn}
                      onPress={handleSubmit}>
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
                          Đăng ký
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate(SCREENS_KEY.SIGNIN)}
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
                        Đăng nhập
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </Animatable.View>
        </>
      )}
    </View>
  );
};

export default SignUpScreen;

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
