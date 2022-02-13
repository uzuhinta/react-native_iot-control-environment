import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {Appbar, List, Button, TouchableRipple} from 'react-native-paper';
import {getDetailInvoice} from '../api/invoice';
import {commonStyles, theme} from '../common/theme';
import {TABS_INVOICE_KEY} from '../navigations/preset';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import {date} from 'yup';
var hash = require('object-hash');

function currencyFormat(num) {
  return '' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default function InvoiceSummaryScreen({navigation}) {
  const [data, setData] = useState({
    totalInvoices: 0,
    totalMoney: 0,
    totalDebit: 0,
    total: 0,
    hash: false,
  });
  useEffect(() => {
    const getData = async () => {
      try {
        // const res = await getSummaryInvoice();
        const res = await getDetailInvoice(null, null, null, 1);
        console.log('res.data', res);
        const hashValue = hash(res.data);
        const {totalInvoices, totalMoney, totalDebit, total} = res.data;
        setData({
          totalInvoices: totalInvoices,
          totalMoney: currencyFormat(totalMoney),
          totalDebit: currencyFormat(totalDebit),
          total: currencyFormat(total),
          hash: hashValue,
        });
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    getData();
  }, []);
  useFocusEffect(() => {
    console.log('focus invoice sumary');
    const getData = async () => {
      try {
        // const res = await getSummaryInvoice();
        const res = await getDetailInvoice(null, null, null, 1);
        console.log('res.data', res);
        const hashValue = hash(res.data);
        if (hashValue !== data.hash) {
          const {totalInvoices, totalMoney, totalDebit, total} = res.data;
          setData({
            totalInvoices: totalInvoices,
            totalMoney: currencyFormat(totalMoney),
            totalDebit: currencyFormat(totalDebit),
            total: currencyFormat(total),
            hash: hashValue,
          });
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo lỗi',
          text2: error.message,
        });
      }
    };
    getData();
  });
  return (
    <>
      <Appbar.Header>
        {/* <Appbar.BackAction /> */}
        <Appbar.Content
          title="Tổng quan hóa đơn"
          // subtitle={`In ${route.params.farm.name}`}
        />
      </Appbar.Header>
      <ScrollView style={commonStyles.container}>
        {/* <TouchableRipple
          style={commonStyles.item}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={commonStyles.itemRow}>
            <Text style={styles.description}>Số lượng hóa đơn</Text>
            <Text style={styles.data}>{data.totalInvoices}</Text>
          </View>
        </TouchableRipple> */}
        <TouchableRipple
          style={commonStyles.item}
          rippleColor="rgba(0, 0, 0, .32)">
          <View>
            <Text style={styles.description}>Tổng số tiền</Text>
            <View style={styles.endText}>
              <Text style={styles.data}>{data.totalMoney} VND</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          rippleColor="rgba(0, 0, 0, .32)">
          <View>
            <Text style={styles.description}>Tổng nợ</Text>
            <View style={styles.endText}>
              <Text style={styles.data}>{data.totalDebit} VND</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          style={commonStyles.item}
          rippleColor="rgba(0, 0, 0, .32)">
          <View>
            <Text style={styles.description}>Số tiền cần thanh toán</Text>

            <View style={styles.endText}>
              <Text style={styles.data}>{data.total} VND</Text>
            </View>
          </View>
        </TouchableRipple>
      </ScrollView>
      <View style={commonStyles.bottomButton}>
        <Button
          mode="contained"
          style={commonStyles.styleBottomButton}
          onPress={() => navigation.navigate(TABS_INVOICE_KEY.INVOICE_DETAIL)}>
          Thanh toán
        </Button>
      </View>
      <View style={commonStyles.bottomButton}>
        <Button
          // mode="contained"
          style={commonStyles.styleBottomButton}
          onPress={() => navigation.navigate(TABS_INVOICE_KEY.INVOICE_DETAIL)}>
          Chi tiết hóa đơn
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  description: {
    marginLeft: 15,
    fontSize: 25,
    marginVertical: 5,
  },
  endText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sectionHeaderStyle: {
    // backgroundColor: '#CDDC89',
    fontSize: 15,
    padding: 10,
    color: '#555555',
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  data: {
    color: theme.colors.primary,
    fontSize: 30,
  },
  center: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
