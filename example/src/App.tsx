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

import { Colors } from 'react-native/Libraries/NewAppScreen';

import YandexPayment, { PaymentType, Currency } from '../../'
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
      style={[
        {
          alignItems: 'center',
          alignContent: 'center',
          padding: 16,
          alignSelf: 'center',
        },
        style,
      ]}
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View>
          <SwitchView
            title="BANK_CARD"
            style={{
              backgroundColor: '#fff',
              paddingVertical: 8,
              marginVertical: 1,
              paddingHorizontal: 16,
            }}
            checked={paymentTypes.includes('BANK_CARD')}
            onChanges={() => {
              changePaymentType('BANK_CARD');
            }}
          />

          <SwitchView
            title="YOO_MONEY"
            style={{
              backgroundColor: '#fff',
              paddingVertical: 8,
              marginVertical: 1,
              paddingHorizontal: 16,
            }}
            checked={paymentTypes.includes('YOO_MONEY')}
            onChanges={() => {
              changePaymentType('YOO_MONEY');
            }}
          />

          <SwitchView
            title="SBERBANK"
            style={{
              backgroundColor: '#fff',
              paddingVertical: 8,
              marginVertical: 1,
              paddingHorizontal: 16,
            }}
            checked={paymentTypes.includes('SBERBANK')}
            onChanges={() => {
              changePaymentType('SBERBANK');
            }}
          />

          <SwitchView
            title="GOOGLE_PAY"
            style={{
              backgroundColor: '#fff',
              paddingVertical: 8,
              marginVertical: 1,
              paddingHorizontal: 16,
            }}
            checked={paymentTypes.includes('GOOGLE_PAY')}
            onChanges={() => {
              changePaymentType('GOOGLE_PAY');
            }}
          />

          <SwitchView
            title="SBP"
            style={{
              backgroundColor: '#fff',
              paddingVertical: 8,
              marginVertical: 1,
              paddingHorizontal: 16,
            }}
            checked={paymentTypes.includes('SBP')}
            onChanges={() => {
              changePaymentType('SBP');
            }}
          />

          <View
            style={{
              backgroundColor: '#fff',
              paddingVertical: 16,
              marginVertical: 16,
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
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
              <Text style={{ flexGrow: 1 }}>Currency</Text>
              <Text>{currency}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Text style={{marginTop: 45, color: "#000"}}>{JSON.stringify(Object.values(state.paymentTypes).filter(it => it !== null))}</Text> */}

        <Button
          style={{
            marginTop: 100,
            backgroundColor: '#ffcc00',
            borderRadius: 8,
          }}
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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
