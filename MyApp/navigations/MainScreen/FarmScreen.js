import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DeviceInfoScreen from '../../screens/DeviceInfoScreen';
import DeviceCropScreen from '../../screens/DeviceCropScreen';
import DeviceSettingScreenNew from '../../screens/DeviceSettingScreenNew';
import ListDeviceScreen from '../../screens/ListDeviceScreen';
import ListFarm from '../../screens/ListFarm';
import {STACK_FARMS} from '../preset';

const stack = [
  {
    name: STACK_FARMS.LIST_FARM,
    component: ListFarm,
    options: {
      ...ListFarm?.options,
      headerShown: false,
    },
  },

  {
    name: STACK_FARMS.DEVICE_LIST,
    component: ListDeviceScreen,
    options: {
      ...ListDeviceScreen?.options,
      headerShown: false,
    },
  },
  {
    name: STACK_FARMS.DEVICE_CROP,
    component: DeviceCropScreen,
    options: {
      ...DeviceCropScreen?.options,
      headerShown: false,
    },
  },
  {
    name: STACK_FARMS.DEVICE_SETTING,
    component: DeviceSettingScreenNew,
    options: {
      ...DeviceCropScreen?.options,
      headerShown: false,
    },
  },
  {
    name: STACK_FARMS.DEVICE_INFO,
    component: DeviceInfoScreen,
    options: {
      ...DeviceInfoScreen?.options,
      headerShown: false,
    },
  },
];

const StackFarm = createStackNavigator();

const stackNavigatorProps = {
  initialRouteName: STACK_FARMS.LIST_FARM,
};

export default function FarmScreen() {
  return (
    <StackFarm.Navigator {...stackNavigatorProps}>
      {stack.map((item) => (
        <StackFarm.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}
    </StackFarm.Navigator>
  );
}
