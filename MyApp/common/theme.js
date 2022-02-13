import {configureFonts, DefaultTheme} from 'react-native-paper';
import {StyleSheet, Dimensions, StatusBar} from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'sans-serif',

      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'bold',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'bold',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'bold',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#009387',
    secondary: '#DCEDE2',
    background: '#f2f2f2',
    backgroundItem: '#DDDDDD',
    // error: '#F0A69B',
    // errorFocus: '#ba000d',
    text: '#000000',
    button: '#009387',
    // require: '#f44336',
    // active: '#d32f2f',
    // materialPrimary: '#2196f3',
    // money: '#FCCF00',
    // inputLabel: '#000000',
    placeholderTextColor: '#444444',
  },
  header: {
    height: 80,
  },
};

export const commonStyles = StyleSheet.create({
  top: {
    // position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  //
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  //section
  sectionHeaderStyle: {
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '80%',
    marginLeft: '10%',
    backgroundColor: '#C8C8C8',
  },
  //Item
  item: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
  },
  row: {
    display: 'flex',
    paddingTop: 5,
    flexDirection: 'row',
  },
  paddingIcon: {
    paddingRight: 10,
  },
  //Bottom button
  bottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  styleBottomButton: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  halfWidth: Dimensions.get('window').width / 2,
  halfHeight: Dimensions.get('window').height / 2,
});
