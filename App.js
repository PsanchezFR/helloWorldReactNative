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
    ProgressBarAndroid
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
        const [syncDataLocal, setSyncData] = useState({message: "No update", progress: false, statusConstant: codePush.SyncStatus.UP_TO_DATE});

    // Constants
        const initialLayout = { width: Dimensions.get('window').width };

    // References
        const cameraRef = useRef(null);

//// CODE PUSH
//
    const codePushStatusDidChange = syncStatus => {
        switch(syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                setSyncData({
                    message: "Checking for update.",
                    statusConstant: codePush.SyncStatus.CHECKING_FOR_UPDATE
                });
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                setSyncData({
                    message: "Downloading package.",
                    statusConstant: codePush.SyncStatus.DOWNLOADING_PACKAGE
                });
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                setSyncData({
                    message: "Awaiting user action.",
                    statusConstant: codePush.SyncStatus.AWAITING_USER_ACTION
                });
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                setSyncData({
                    message: "Installing update.",
                    statusConstant: codePush.SyncStatus.INSTALLING_UPDATE
                });
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                setSyncData({
                    message: "App up to date.",
                    progress: false,
                    statusConstant: codePush.SyncStatus.UP_TO_DATE
                });
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                setSyncData({
                    message: "Update cancelled by user.",
                    progress: false,
                    statusConstant: codePush.SyncStatus.UPDATE_IGNORED
                });
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                setSyncData({
                    message: "Update installed and will be applied on restart.",
                    progress: false,
                    statusConstant: codePush.SyncStatus.UPDATE_INSTALLED
                });
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                setSyncData({
                    message: "An unknown error occurred.",
                    progress: false,
                    statusConstant: codePush.SyncStatus.UNKNOWN_ERROR
                });
                break;
        }
    };

    const updateProgress = progress => {setSyncData({message: syncDataLocal.message, progress: progress})};

    codePush.sync(
        {
            updateDialog: true,
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
        },
        codePushStatusDidChange,
        updateProgress,
    );


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
            onPress={() => setBarcode(null)}
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


    });

//// RENDER
//
  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="#2aba56" barStyle="light-content" />
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
        <Text style={styles.updateMessageBar}>{syncDataLocal.message}</Text>
        <ProgressBarAndroid
            style={styles.updateProgressBar}
            progress={Number.isNaN(syncDataLocal.progress) ? syncDataLocal.progress : 0}
            indeterminate={
                [codePush.SyncStatus.CHECKING_FOR_UPDATE,
                    codePush.SyncStatus.AWAITING_USER_ACTION,
                    codePush.SyncStatus.CHECKING_FOR_UPDATE].includes(syncDataLocal.statusConstant)
            }
            styleAttr={"Horizontal"}
        />
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
    },
    updateMessageBar: {
        height: 20,
        width: "100%"
    },
    updateProgressBar: {
        height: 6,
        backgroundColor: "#2aba56",
        width: "100%"
    },
    bottomBarContainer: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: '#999999',
        height: 25,
        width: "100%"
    }
});

let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,

};

App = codePush(codePushOptions)(App);
export default App;
