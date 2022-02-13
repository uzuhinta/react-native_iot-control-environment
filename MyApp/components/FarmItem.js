import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTheme} from 'react-native-paper';
import {TouchableHighlight} from 'react-native';

const Item = (props) => {
  return (
    <View>
      <Text>{props.name}</Text>
      <Text>{props.address}</Text>
      <Text>{props.description}</Text>
    </View>
  );
};

const FarmItem = (props) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => alert('Pressed!')}>
      <Item
        name={props.name}
        address={props.address}
        description={props.description}
      />
    </TouchableHighlight>
  );
};

export default FarmItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cccccc',
    marginStart: 5,
    marginEnd: 5,
    marginBottom: 4,
  },
});
