import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TABS_KEY} from '../preset';
import {theme} from './../../common/theme';
// import {DEFAULT_CONFIG} from './Stack.config';
import FarmScreen from './FarmScreen';
import TopSettingScreen from './TopSettingScreen';

const noAuth = [
  {
    name: TABS_KEY.LIST_FARM,
    component: FarmScreen,
    options: {
      ...FarmScreen?.options,
      tabBarLabel: TABS_KEY.LIST_FARM,
      tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons name="focus-field" size={23} />
      ),
    },
  },
  {
    name: TABS_KEY.TAB_SETTING,
    component: TopSettingScreen,
    options: {
      ...TopSettingScreen?.options,
      tabBarLabel: TABS_KEY.TAB_SETTING,
      tabBarIcon: ({color, size}) => <Feather name="user" size={23} />,
    },
  },
];

const FarmIcon = (props) => {
  const activate = props.activate;

  return (
    <MaterialCommunityIcons
      name="focus-field"
      color={activate ? theme.colors.primary : 'black'}
      size={23}
    />
  );
};

const SettingIcon = (props) => {
  const activate = props.activate;

  return (
    <Feather
      name="user"
      color={activate ? theme.colors.primary : 'black'}
      size={23}
    />
  );
};

const {Navigator, Screen} = createBottomTabNavigator();
const BottomTabBar = ({navigation, state}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <BottomNavigation
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        navigation.navigate(state.routeNames[index]);
      }}>
      <BottomNavigationTab
        title="Vườn"
        icon={() => (
          <FarmIcon activate={selectedIndex === 0 ? 'true' : false} />
        )}
      />

      <BottomNavigationTab
        title="Cài đặt"
        icon={() => (
          <SettingIcon activate={selectedIndex === 1 ? 'true' : false} />
        )}
      />
    </BottomNavigation>
  );
};

export default function MainScreen() {
  return (
    <Navigator
      initialRouteName="Farm"
      backBehavior="none"
      tabBar={(props) => <BottomTabBar {...props} />}>
      <Screen name="Farm" component={FarmScreen} />
      <Screen name="Setting" component={TopSettingScreen} />
    </Navigator>
  );
}
