import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider} from '@ui-kitten/components';
import * as React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {signin} from './api/auth';
import {AuthContext} from './common/AuthContext';
import {theme} from './common/theme';
import {default as themekitten} from './common/theme.json';
import MainScreen from './navigations/MainScreen';
import NoAuth from './navigations/NoAuth';
import SplashScreen from './screens/SplashScreen';

const validateExpire = (oldTime, expDay) => {
  const old = new Date(oldTime).getTime();
  const present = new Date().getTime();
  const exp = expDay * 86400000;
  // const exp = 20;
  console.log('check expppppp : ', present, old, present - old <= exp);
  return present - old <= exp;
};

export default function App() {
  const [firstLaunch, setFirstLaunch] = React.useState(true);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        console.log('refresh progress ...');

        const startToken = await AsyncStorage.getItem('startToken');
        setTimeout(() => setFirstLaunch(false), 3000);

        if (startToken && validateExpire(startToken, 1)) {
          userToken = await AsyncStorage.getItem('userToken');
        } else {
          await AsyncStorage.clear();
          console.log('refresh token  progress ....');
          dispatch({type: 'SIGN_OUT'});
        }
      } catch (e) {
        // Restoring token failed
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: e.message,
        });
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (inData) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('Data in form signin', inData);
        console.log('Signin progress ....');
        try {
          const res = await signin(inData);
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
            await AsyncStorage.setItem('userToken', data.jwt);
            await AsyncStorage.setItem('topicName', data.topicName);
            var signinDate = new Date();
            var signinDateString = signinDate.toString();
            await AsyncStorage.setItem('startToken', signinDateString);
            dispatch({type: 'SIGN_IN', token: data.jwt});
          }
        } catch (error) {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'Thông báo lỗi',
            text2: error.message,
          });
        }
      },
      signOut: async () => {
        await AsyncStorage.clear();
        console.log('signout progress ....');

        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('signup progress ....');

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );
  return (
    <ApplicationProvider {...eva} theme={{...eva.light, ...themekitten}}>
      <PaperProvider
        theme={theme}
        settings={{icon: (props) => <AwesomeIcon {...props} />}}>
        <StatusBar
          backgroundColor={theme.colors.primary}
          barStyle="light-content"
        />
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            {/* {state.isLoading && firstLaunch ? ( */}
            {firstLaunch ? (
              <SplashScreen />
            ) : state.userToken == null ? (
              // No token found, user isn't signed in
              <NoAuth />
            ) : (
              // User is signed in
              <MainScreen />
              // <InvoiceSummaryScreen />
            )}
          </NavigationContainer>
        </AuthContext.Provider>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PaperProvider>
    </ApplicationProvider>
  );
}
