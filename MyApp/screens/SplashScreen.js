import React from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import {theme} from './../common/theme';
import * as Animatable from 'react-native-animatable';
const zoomOut = {
  0: {
    opacity: 0,
    scale: 0,
  },

  0.5: {
    opacity: 1,
    scale: 0.3,
  },
  1: {
    opacity: 1,
    scale: 1.9,
  },
};
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Animatable.Image
        delay={1000}
        source={require('../assets/logo.png')}
        animation={zoomOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
