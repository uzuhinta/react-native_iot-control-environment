import {View, Button, Text} from 'react-native';

import React from 'react';
import {AuthContext} from '../common/AuthContext';

export default function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
