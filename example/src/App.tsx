import React, { type FC, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  type ViewStyle,
} from 'react-native';

import YandexPayment, { type PaymentType, type Currency } from '../../'
import SwitchView from './components/SwitchView';
import config from './config';

interface ButtonProps {
  onPress: () => void;
  style: ViewStyle;
  title: string;
}

const Button: FC<ButtonProps> = ({ onPress, style, title }) => {
  return (
    <TouchableOpacity
      style={[styles.button,style]}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [currency, _] = useState<Currency>('RUB');

  const changePaymentType = (paymentType: PaymentType) => {
    if (paymentTypes.includes(paymentType)) {
      setPaymentTypes(paymentTypes =>
        paymentTypes.filter(p => p !== paymentType)
      )
    } else {
      setPaymentTypes(paymentTypes =>
        [...paymentTypes, paymentType]
      )
    }
  };

  // const onSelectCurrency = (currency: any) => {
  //   setState({ ...state, currency });
  // };

  const allPaymentTypes: PaymentType[] = [
    'BANK_CARD',
    'YOO_MONEY',
    'SBERBANK',
    'GOOGLE_PAY',
    'SBP'
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View>
          {allPaymentTypes.map(paymentType => (
            <SwitchView
              key={paymentType}
              title={paymentType}
              style={styles.switch}
              checked={paymentTypes.includes(paymentType)}
              onChanges={() => {
                changePaymentType(paymentType);
              }}
            />
          ))}

          <View style={styles.currency}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                // new SheetMenu({
                //   title: 'Select currency:',
                //   actions: [
                //     {
                //       title: 'RUB',
                //       onPress: () => setCurrency('RUB'),
                //     },
                //     {
                //       title: 'EUR',
                //       onPress: () => setCurrency('EUR'),
                //     },
                //     {
                //       title: 'USD',
                //       onPress: () => setCurrency('USD'),
                //     },
                //   ],
                // }).show()
              }}
            >
              <Text style={styles.flexGrow}>Currency</Text>
              <Text>{currency}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          style={styles.payButton}
          title="YandexPayment.show()"
          onPress={async () => {
            try {
              const result = await YandexPayment.show(
                {
                  id: config.id,
                  token: config.token,
                  name: 'React shop',
                  description: `Buy on ${Platform.OS} ${Platform.Version}`,
                },
                {
                  amount: 1.01,
                  currency,
                  types: paymentTypes,
                  yooKassaClientId: 'clientId',
                  savePaymentMethod: 'OFF'
                }
              );
              YandexPayment.close();
              console.warn(JSON.stringify(result));
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 16,
    alignSelf: 'center',
  },
  scrollView: {
    backgroundColor: '#eee',
  },
  switch: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginVertical: 1,
    paddingHorizontal: 16,
  },
  payButton: {
    marginTop: 100,
    backgroundColor: '#ffcc00',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 1,
  },
  currency: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});

export default App;
