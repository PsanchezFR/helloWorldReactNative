/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import codePush from "react-native-code-push";


function App() {

  //
  // const cancel = () => {
  //     NfcManager.unregisterTagEvent().catch(() => 0);
  // };

  // const test = async () => {
  //     try {
  //         await NfcManager.registerTagEvent();
  //     } catch (ex) {
  //         console.warn('ex', ex);
  //         NfcManager.unregisterTagEvent().catch(() => 0);
  //     }
  // };

  const [] = useState(false);


  useEffect(() => {
    const updater = new Updater({
      repo: 'pct-org/getting-started',

      onUpdateAvailable: onUpdateAvailable,
      onDownloadStart: onDownloadStart,
      onProgress: onProgress,
    });

    if( NfcManager != null){
      NfcManager.start();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        alert('tag', tag);
        NfcManager.setAlertMessageIOS('I got your tag!');
        NfcManager.unregisterTagEvent().catch(() => 0);
      });
    }

  });

  // UPDATE FUNCTIONS

  const onUpdateAvailable = (githubRelease, update) => {
    this.setState({
      updateAvailable: true,
      animating: true,
      githubRelease,
      update,
    })
  };

  const onDownloadStart = () => {
    this.setState({
      updating: true,
    })
  };

  const onProgress = (progress) => {
    this.setState({
      progress,
    })
  };

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
App = codePush(App);
export default App;
