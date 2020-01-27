/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, useRef} from 'react';
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
import { RNCamera } from 'react-native-camera';

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Waiting</Text>
    </View>
);

function App() {

  const [NFCmessage, setNFCmessage] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const cameraRef = useRef(null);

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

  const barcodeHandler = barcodeData => setBarcode(barcodeData);






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

      <ScrollView alignContent={'center'} style={styles.pageStyle} key="2">
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
          <Text>QR code Scanner</Text>
          <RNCamera
              ref={cameraRef}
              type={RNCamera.Constants.Type.back}
              style={{
                  flex: 1,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'red',
                  minHeight: 450,
                  margin: 20
              }}
              autofocus={RNCamera.Constants.AutoFocus.off}
              focusDepth={0.1}
              onBarCodeRead={barcodeHandler}
          >
              {({ camera, status, recordAudioPermissionStatus }) => {
                  if (status !== 'READY') return <PendingView />;
              }}
              </RNCamera>
          <TouchableOpacity
              style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
              onPress={() => setBarcode(null)}s
          >
              <Text>Reset</Text>
          </TouchableOpacity>

          <Text style={{padding: 10, width: 200, margin: 20}}>QR codes: {barcode != null ? barcode.data : '-'}</Text>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
      height: '100%'
  },
  pageStyle: {

    padding: 20,
  }
});

App = codePush(App);
export default App;
