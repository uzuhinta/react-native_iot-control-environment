// import React from 'react';
// // import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import DeviceInfoScreen from '../../screens/DeviceInfoScreen';
// import DeviceSettingScreen from '../../screens/DeviceSettingScreen';
// import {TABS_DEVICE_KEY} from '../preset';
// const tabs = [
//   {
//     name: TABS_DEVICE_KEY.DEVICE_INFO,
//     component: DeviceInfoScreen,
//     option: {
//       ...DeviceInfoScreen?.option,
//     },
//   },
//   {
//     name: TABS_DEVICE_KEY.DEVICE_SETTING,
//     component: DeviceSettingScreen,
//     option: {
//       ...DeviceSettingScreen?.option,
//     },
//   },
// ];

// const DeviceTab = createBottomTabNavigator();

// export default function TabDevice() {
//   return (
//     <DeviceTab.Navigator>
//       {tabs.map((tab) => {
//         <DeviceTab.Screen
//           key={tab.name}
//           name={tab.name}
//           component={tab.component}
//           options={tab.options}
//           // {...tab}
//         />;
//       })}
//     </DeviceTab.Navigator>
//   );
// }

import React from 'react';

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {createStackNavigator} from '@react-navigation/stack';
import {TABS_DEVICE_KEY} from '../preset';

// import {DEFAULT_CONFIG} from './Stack.config';

import DeviceInfoScreen from '../../screens/DeviceInfoScreen';
import DeviceSettingScreen from '../../screens/DeviceSettingScreen';
import ListDeviceScreen from '../../screens/ListDeviceScreen';

const topDeviceScreen = [
  {
    name: TABS_DEVICE_KEY.DEVICE_LIST,
    component: ListDeviceScreen,
    options: {
      ...ListDeviceScreen?.options,
      headerShown: false,
    },
  },
  {
    name: TABS_DEVICE_KEY.DEVICE_INFO,
    component: DeviceInfoScreen,
    options: {
      ...DeviceInfoScreen?.options,
    },
  },
  {
    name: TABS_DEVICE_KEY.DEVICE_SETTING,
    component: DeviceSettingScreen,
    options: {
      ...DeviceSettingScreen?.options,
    },
  },
];

const TopDevice = createMaterialTopTabNavigator();

const stackNavigatorProps = {
  initialRouteName: TABS_DEVICE_KEY.DEVICE_INFO,
};

export default function TopDeviceScreen() {
  return (
    <TopDevice.Navigator
      // headerMode="none"
      //   initialRouteName={SCREENS_KEY.LOGIN}
      {...stackNavigatorProps}>
      {topDeviceScreen.map((item) => (
        <TopDevice.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}

          // {...item}
        />
      ))}
    </TopDevice.Navigator>
  );
}
