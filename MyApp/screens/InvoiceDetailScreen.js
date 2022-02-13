import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, Button} from 'react-native';
import {} from 'react-native';
import {Appbar, DataTable} from 'react-native-paper';
import {getDetailInvoice} from './../api/invoice';

const itemsPerPage = 6;

const minAB = (a, b) => {
  return a > b ? b : a;
};
export default function InvoiceDetailScreen({navigation}) {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState(0);
  const from = page * itemsPerPage;
  const to = minAB((page + 1) * itemsPerPage, total);
  useEffect(() => {
    const getData = async () => {
      const res = await getDetailInvoice(null, page + 1, itemsPerPage, 1);
      console.log(res);
      const resData = res.data;
      setTotal(resData.totalInvoices);
      setData(resData.invoices);
      console.log('trigger');
    };
    getData();
  }, [page]);
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content
          title="Chi tiết hóa đơn"
          // subtitle={`In ${route.params.farm.name}`}
        />
      </Appbar.Header>
      <ScrollView>
        {/* <Text>InvoiceSummaryScreen</Text> */}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>#</DataTable.Title>
            <DataTable.Title style={{flex: 5}}>Tên hóa đơn</DataTable.Title>
            <DataTable.Title numeric>Tiền</DataTable.Title>
          </DataTable.Header>
          {data
            ? data.map((item, index) => {
                return (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{from + index + 1}</DataTable.Cell>
                    <DataTable.Cell style={{flex: 5}}>
                      {item.name}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{item.money}</DataTable.Cell>
                  </DataTable.Row>
                );
              })
            : null}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(total / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${total}`}
          />
        </DataTable>
      </ScrollView>
    </>
  );
}
