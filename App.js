/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, useRef} from 'react';
import {TabView, TabBar, SceneMap} from "react-native-tab-view";
import {
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
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
            backgroundColor: "#FFFFFF",
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <ActivityIndicator size="large" color="#2aba56"/>
    </View>
);

function App() {

//// VARIABLES
//
    // states
        const [NFCmessage, setNFCmessage] = useState(null);
        const [barcode, setBarcode] = useState(null);
        const [index, setIndex] = useState(0);
        const [routes] = useState([
            { key: 'first', title: 'NFC' },
            { key: 'second', title: 'QR Scan' },
        ]);

    // Constants
        const initialLayout = { width: Dimensions.get('window').width };

    // References
        const cameraRef = useRef(null);

//// TOOL METHODS
//
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



//// VIEWS METHODS
//
    const NFCview = () => (<View alignContent={'center'} style={styles.pageStyle}>
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
  </View>);

    const QRView = () => (<ScrollView alignContent={'center'} style={styles.pageStyle}>
        <Text>QR code Scanner</Text>
        <RNCamera
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
            style={{
                flex: 1,
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
    </ScrollView>);

    const RENDER_SCENE = SceneMap({
        first: NFCview,
        second: QRView,
    });

//// USE EFFECTS
//
    useEffect(() => {
        if( NfcManager != null){
            NfcManager.start();
            NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
                NfcManager.setAlertMessageIOS('I got your tag!');
                setNFCmessage(NdefParser.parseText(tag.ndefMessage[0]));
                NfcManager.unregisterTagEvent().catch(() => 0);
            });
        }
    }, []);

//// RENDER
//
  return (
    <View style={styles.container}>
        <TabView
            navigationState={{ index, routes }}
            renderScene={RENDER_SCENE}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            lazy={true}
            renderTabBar={ props =>
                <TabBar {...props}
                        style={styles.tabBar}
                        indicatorStyle={styles.indicator}
                />
            }
        />
        <StatusBar backgroundColor="#2aba56" barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      height: '100%'
    },
    pageStyle: {
    flex: 1
    },
    tabBar: {
      backgroundColor: "#2aba56"
    },
    indicator: {
        backgroundColor: "#FFFFFF"
    }
});

App = codePush(App);
export default App;
