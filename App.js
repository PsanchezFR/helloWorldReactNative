/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
Alert,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import NfcManager , {NfcEvents, NdefParser} from 'react-native-nfc-manager';
import codePush from "react-native-code-push";


function App() {

  const [NFCmessage, setNFCmessage] = useState(false);

  const cancel = () => {
      NfcManager.unregisterTagEvent().catch(() => 0);
      setNFCmessage('-');
  };

  const test = async () => {


      try {
          await NfcManager.registerTagEvent();
      } catch (ex) {
          console.warn('ex', ex);

          NfcManager.unregisterTagEvent().catch(() => 0);
      }
  };




  useEffect(() => {
    if( NfcManager != null){
      NfcManager.start();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        NfcManager.setAlertMessageIOS('I got your tag!');
          setNFCmessage(NdefParser.parseText(tag.ndefMessage[0]));
        NfcManager.unregisterTagEvent().catch(() => 0);
      });
    }

  });

  return (

      <View style={styles.pageStyle} key="2">
        <Text>NFC Demo</Text>
        <TouchableOpacity
            style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
            onPress={test}
        >
          <Text>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
            onPress={cancel}
        >
          <Text>Cancel Test</Text>
        </TouchableOpacity>
          <Text>NFC message:{NFCmessage || '-'}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  }
});

App = codePush(App);
export default App;
