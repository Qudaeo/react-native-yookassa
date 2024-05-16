import React, { Component, type FC } from 'react';
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
//import SheetMenu from 'react-native-sheetmenu'

import YandexPayment from '../../';
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

class App extends Component {
  state = {
    paymentTypes: {
      YOO_MONEY: null,
      GOOGLE_PAY: null,
      BANK_CARD: null,
      SBERBANK: null,
      SBP: null,
    },
    currency: 'RUB',
  };

  changePaymentType = (checked: any, code: any) => {
    const paymentTypes: any = this.state.paymentTypes;
    paymentTypes[code] = checked ? code : null;
    this.setState({ paymentTypes });
  };

  onSelectCurrency = (currency: any) => {
    this.setState({
      currency: currency,
    });
  };

  render() {
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
              checked={!!this.state.paymentTypes['BANK_CARD']}
              onChanges={(checked) => {
                this.changePaymentType(checked, 'BANK_CARD');
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
              checked={!!this.state.paymentTypes['YOO_MONEY']}
              onChanges={(checked) => {
                this.changePaymentType(checked, 'YOO_MONEY');
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
              checked={!!this.state.paymentTypes['SBERBANK']}
              onChanges={(checked) => {
                this.changePaymentType(checked, 'SBERBANK');
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
              checked={!!this.state.paymentTypes['GOOGLE_PAY']}
              onChanges={(checked) => {
                this.changePaymentType(checked, 'GOOGLE_PAY');
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
              checked={!!this.state.paymentTypes['SBP']}
              onChanges={(checked) => {
                this.changePaymentType(checked, 'SBP');
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
                  //       onPress: () => this.onSelectCurrency('RUB'),
                  //     },
                  //     {
                  //       title: 'EUR',
                  //       onPress: () => this.onSelectCurrency('EUR'),
                  //     },
                  //     {
                  //       title: 'USD',
                  //       onPress: () => this.onSelectCurrency('USD'),
                  //     },
                  //   ],
                  // }).show()
                }}
              >
                <Text style={{ flexGrow: 1 }}>Currency</Text>
                <Text>{this.state.currency}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <Text style={{marginTop: 45, color: "#000"}}>{JSON.stringify(Object.values(this.state.paymentTypes).filter(it => it !== null))}</Text> */}

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
                    // @ts-ignore
                    currency: this.state.currency,
                    // @ts-ignore
                    types: Object.values(this.state.paymentTypes).filter(
                      (it) => it !== null
                    ),
                    yooKassaClientId: config.id,
                  }
                );
                YandexPayment.close()
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
