import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Button, Text, View} from 'react-native';
import {AuthContext, globalState} from '../common/AuthProvider';
// import BottomTabs from './BottomTabs';
import NoAuth from './NoAuth';

const RootStack = createStackNavigator();
function BottomTabs() {
  const {signOut} = useContext(AuthContext);
  return (
    <View>
      <Text>BottomsTab</Text>
      <Button title="SignOut" onPress={signOut} />
    </View>
  );
}

export default function Navigation() {
  const {userToken} = globalState;
  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator mode="modal" headerMode="none">
          {userToken ? (
            <RootStack.Screen name="BottomsTab" component={BottomTabs} />
          ) : (
            <RootStack.Screen name="NoAuth" component={NoAuth} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}
