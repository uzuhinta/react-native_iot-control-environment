// import React from 'react';
// // import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import InvoiceDetailScreen from '../../screens/InvoiceDetailScreen';
// import InvoiceSummaryScreen from '../../screens/InvoiceSummaryScreen';
// import {INVOICE_KEY} from '../preset';
// const tabs = [
//   {
//     name: INVOICE_KEY.INVOICE_SUMMARY,
//     component: InvoiceSummaryScreen,
//     option: {
//       ...InvoiceSummaryScreen?.option,
//     },
//   },
//   {
//     name: INVOICE_KEY.INVOICE_DETAIL,
//     component: InvoiceDetailScreen,
//     option: {
//       ...InvoiceDetailScreen?.option,
//     },
//   },
// ];

// // const InvoiceTab = createMaterialTopTabNavigator();
// const InvoiceTab = createBottomTabNavigator();

// const stackNavigatorProps = {
//   initialRouteName: INVOICE_KEY.INVOICE_SUMMARY,
// };

// export default function TabInvoice() {
//   return (
//     <InvoiceTab.Navigator {...stackNavigatorProps}>
//       {tabs.map((tab) => {
//         <InvoiceTab.Screen {...tab} />;
//       })}
//       {/* <TabInvoice.Screen name="123" component={InvoiceDetailScreen} /> */}
//       {/* <TabInvoice.Screen name="123fsdfa" component={InvoiceSummaryScreen} /> */}
//     </InvoiceTab.Navigator>
//   );
// }

import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {TABS_INVOICE_KEY} from '../preset';

// import {DEFAULT_CONFIG} from './Stack.config';

import InvoiceSummaryScreen from '../../screens/InvoiceSummaryScreen';
import InvoiceDetailScreen from '../../screens/InvoiceDetailScreen';

const topInvoiceScreen = [
  {
    name: TABS_INVOICE_KEY.INVOICE_SUMMARY,
    component: InvoiceSummaryScreen,
    options: {
      ...InvoiceSummaryScreen?.options,
      headerShown: false,
    },
  },
  {
    name: TABS_INVOICE_KEY.INVOICE_DETAIL,
    component: InvoiceDetailScreen,
    options: {
      ...InvoiceDetailScreen?.options,
      headerShown: false,
    },
  },
];

const TopInvoice = createStackNavigator();

const stackNavigatorProps = {
  initialRouteName: TABS_INVOICE_KEY.INVOICE_SUMMARY,
};

export default function TopInvoiceScreen() {
  return (
    <TopInvoice.Navigator
      // headerMode="none"
      //   initialRouteName={SCREENS_KEY.LOGIN}
      {...stackNavigatorProps}>
      {topInvoiceScreen.map((item) => (
        <TopInvoice.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}

          // {...item}
        />
      ))}
    </TopInvoice.Navigator>
  );
}
