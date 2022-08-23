import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

const isiOS = Platform.OS === 'ios';

const { RNMaio } = NativeModules;

export enum EventType {
  initialized = 'initialized',
  opened = 'opened', // Android only
  started = 'started',
  clicked = 'clicked',
  finished = 'finished',
  closed = 'closed',
  error = 'error',
}

export enum MaioFailReason {
  Unknown = 'Unknown',
  AdStockOut = 'Ad stock out',
  NetworkServer = 'Network server error',
  NetworkClient = 'Network client error',
  VideoPlayback = 'Video playback',
  // iOS only
  SDK = 'SDK error',
  NetworkConnection = 'Network connection',
  DownloadCancelled = 'Download cancelled',
  IncorrectMediaId = 'Incorrect MediaId',
  IncorrectZoneId = 'Incorrect ZoneId',
  NotFoundViewContext = 'View Context not found',
}

/**
 * @interface define MaioEvent
 */
export interface MaioEvent {
  type: EventType;
  skipped?: boolean;
  error?: MaioFailReason;
}

/**
 * @function addMaioListener listen event of Advertising(init, open, close, ...)
 */
export function addMaioListener(
  listener: (maioEvent: MaioEvent) => void
): EmitterSubscription {
  const _eventEmitter = new NativeEventEmitter(RNMaio);
  return _eventEmitter.addListener('Maio', listener);
}

/**
 * @function check checkCBAction - callback Action available or not
 * @param isReady - from isAdvertisingReady - require
 * @param cbAction - callback Action - optional
 */
const checkCBAction = (isReady: boolean, cbAction?: () => void) => {
  if (isReady && cbAction) {
    return cbAction();
  }
};

/**
 * @function check Adverting ready to display or not
 * @param cbAction is callback Action - optional
 */
export function isAdvertisingReady(cbAction?: () => void): void {
  if (isiOS) {
    RNMaio.isAdvertisingReady('', (isReady: boolean) => {
      return checkCBAction(isReady, cbAction);
    });
  } else {
    RNMaio.isAdvertisingReady((isReady: boolean) => {
      return checkCBAction(isReady, cbAction);
    });
  }
}

/**
 * @function show Advertising
 */
export function onShowAdvertising(): void {
  return RNMaio.onShowAdvertising();
}

/**
 * @function check and show Advertising
 */
export function onCheckAndShowAdvertising(): void {
  return RNMaio.onCheckAndShowAdvertising();
}
