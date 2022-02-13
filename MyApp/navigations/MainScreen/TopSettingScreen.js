// // import React from 'react';
// // // import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// // import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// // import InvoiceDetailScreen from '../../screens/InvoiceDetailScreen';
// // import InvoiceSummaryScreen from '../../screens/InvoiceSummaryScreen';
// // import {INVOICE_KEY} from '../preset';
// // const tabs = [
// //   {
// //     name: INVOICE_KEY.INVOICE_SUMMARY,
// //     component: InvoiceSummaryScreen,
// //     option: {
// //       ...InvoiceSummaryScreen?.option,
// //     },
// //   },
// //   {
// //     name: INVOICE_KEY.INVOICE_DETAIL,
// //     component: InvoiceDetailScreen,
// //     option: {
// //       ...InvoiceDetailScreen?.option,
// //     },
// //   },
// // ];

// // // const InvoiceTab = createMaterialTopTabNavigator();
// // const InvoiceTab = createBottomTabNavigator();

// // const stackNavigatorProps = {
// //   initialRouteName: INVOICE_KEY.INVOICE_SUMMARY,
// // };

// // export default function TabInvoice() {
// //   return (
// //     <InvoiceTab.Navigator {...stackNavigatorProps}>
// //       {tabs.map((tab) => {
// //         <InvoiceTab.Screen {...tab} />;
// //       })}
// //       {/* <TabInvoice.Screen name="123" component={InvoiceDetailScreen} /> */}
// //       {/* <TabInvoice.Screen name="123fsdfa" component={InvoiceSummaryScreen} /> */}
// //     </InvoiceTab.Navigator>
// //   );
// // }

// import React from 'react';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// import {TABS_SETTING_KEY} from '../preset';

// import SettingScreen from '../../screens/SettingScreen';
// import ChangePasswordScreen from '../../screens/ChangePasswordScreen';
// import {createStackNavigator} from '@react-navigation/stack';

// const topSettingScreen = [
//   {
//     name: TABS_SETTING_KEY.SETTING,
//     component: SettingScreen,
//     options: {
//       ...SettingScreen?.options,
//       // headerShown: false,
//     },
//   },
//   {
//     name: TABS_SETTING_KEY.CHANGE_PASSWORD,
//     component: ChangePasswordScreen,
//     options: {
//       ...ChangePasswordScreen?.options,
//       // headerShown: false,
//     },
//   },
// ];

// const TopSetting = createStackNavigator();

// const stackNavigatorProps = {
//   initialRouteName: TABS_SETTING_KEY.SETTING,
// };

// export default function TopSettingScreen() {
//   return (
//     <TopSetting.Navigator {...stackNavigatorProps}>
//       {topSettingScreen.map((item) => (
//         <TopSetting.Screen
//           key={item.name}
//           name={item.name}
//           component={item.component}
//           options={item.options}
//         />
//       ))}
//     </TopSetting.Navigator>
//   );
// }

import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ChangePasswordScreen from '../../screens/ChangePasswordScreen';
import SettingScreen from '../../screens/SettingScreen';
import InformationScreen from '../../screens/InformationScreen';
import ChangeInformation from '../../screens/ChangeInformation';
import {TABS_SETTING_KEY} from '../preset';

const stack = [
  {
    name: TABS_SETTING_KEY.SETTING,
    component: SettingScreen,
    options: {
      ...SettingScreen?.options,
      headerShown: false,
    },
  },

  {
    name: TABS_SETTING_KEY.CHANGE_PASSWORD,
    component: ChangePasswordScreen,
    options: {
      ...ChangePasswordScreen?.options,
      headerShown: false,
    },
  },
  {
    name: TABS_SETTING_KEY.INFORMATION,
    component: InformationScreen,
    options: {
      ...InformationScreen?.options,
      headerShown: false,
    },
  },
  {
    name: TABS_SETTING_KEY.CHANGE_INFORMATION,
    component: ChangeInformation,
    options: {
      ...ChangeInformation?.options,
      headerShown: false,
    },
  },
];

const StackFarm = createStackNavigator();

const stackNavigatorProps = {
  initialRouteName: TABS_SETTING_KEY.SETTING,
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
