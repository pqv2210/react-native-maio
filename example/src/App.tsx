import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import {
  addMaioListener,
  EventType,
  isAdvertisingReady,
  MaioEvent,
  onShowAdvertising,
} from 'react-native-maio';

export default function App() {
  const [version, setVersion] = React.useState<string>('');
  const [reason, setReason] = React.useState<string>('');
  const [isReady, setIsReady] = React.useState<boolean>(false);

  const checkADS = async () => {
    const isReady = await isAdvertisingReady();
    setIsReady(isReady);
  };

  React.useEffect(() => {
    checkADS();
    addMaioListener((event: MaioEvent) => {
      switch (event.type) {
        case EventType.initialized:
          setVersion(event.version ?? '');
          break;
        case EventType.opened:
        case EventType.started:
        case EventType.clicked:
        case EventType.closed:
          console.log('Maio event: ', event.type);
          break;
        case EventType.finished:
          console.log('Maio skipped: ', event.skipped);
          break;
        case EventType.error:
          setReason(event.error ?? '');
          break;
      }
    });
  }, []);

  return (
    <SafeAreaView style={CONTAINER}>
      <Image style={LOGO} source={require('./maio-logo.png')} />
      <Text style={TX}>
        Maio SDK {version !== '' && `v${version} `}initialized
      </Text>
      <Text style={TX}>ADS is ready : {isReady.toString()}</Text>
      {reason !== '' && <Text style={TX}>Reason : {reason}</Text>}
      <TouchableOpacity style={BTN} onPress={onShowAdvertising}>
        <Text style={TX_BTN}>Show video ADS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
};

const LOGO: ImageStyle = {
  width: 170,
  resizeMode: 'contain',
};

const TX: TextStyle = { color: '#000000' };

const BTN: ViewStyle = {
  width: 200,
  paddingVertical: 12,
  marginTop: 20,
  borderRadius: 5,
  backgroundColor: '#1b95e0',
};

const TX_BTN: TextStyle = {
  color: '#FFFFFF',
  alignSelf: 'center',
};
