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

import NfcManager , {NfcEvents} from 'react-native-nfc-manager';
import codePush from "react-native-code-push";


function App() {


  const cancel = () => {
      NfcManager.unregisterTagEvent().catch(() => 0);
  };

  const test = async () => {
      try {
          await NfcManager.registerTagEvent();
      } catch (ex) {
          console.warn('ex', ex);
          NfcManager.unregisterTagEvent().catch(() => 0);
      }
  };

  const [] = useState(false);


  useEffect(() => {
    if( NfcManager != null){
      NfcManager.start();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        alert('tag', tag);
        NfcManager.setAlertMessageIOS('I got your tag!');
        NfcManager.unregisterTagEvent().catch(() => 0);
      });
    }

  });

  return (

      <View style={styles.pageStyle} key="2">
        <Text>NFC Demo</Text>
        <TouchableOpacity
            style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
            onPress={() => null }
        >
          <Text>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
            onPress={() => null }
        >
          <Text>Cancel Test</Text>
        </TouchableOpacity>
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
