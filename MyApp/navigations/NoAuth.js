import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {SCREENS_KEY} from './preset';

// import {DEFAULT_CONFIG} from './Stack.config';

import SignInScreen from '../screens/SignInScreen';
import SignupScreen from '../screens/SignupScreen';

const noAuth = [
  {
    name: SCREENS_KEY.SIGNIN,
    component: SignInScreen,
    options: {
      ...SignInScreen?.options,
    },
  },
  //   {
  //     name: SCREENS_KEY.WELCOME,
  //     component: Welcome,
  //     options: {
  //       ...Welcome?.options,
  //     },
  //   },
  {
    name: SCREENS_KEY.SIGNUP,
    component: SignupScreen,
    options: {
      ...SignupScreen?.options,
    },
  },
];

const NoAuthStack = createStackNavigator();

const stackNavigatorProps = {
  initialRouteName: SCREENS_KEY.SIGNIN,
};

export default function NoAuth() {
  return (
    <NoAuthStack.Navigator
      headerMode="none"
      //   initialRouteName={SCREENS_KEY.LOGIN}
      {...stackNavigatorProps}>
      {noAuth.map((item) => (
        <NoAuthStack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}
    </NoAuthStack.Navigator>
  );
}
