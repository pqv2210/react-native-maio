import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

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
  version?: string;
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
 * @function check Adverting ready to display or not
 * @param cbAction is callback Action - optional
 */
export async function isAdvertisingReady(): Promise<boolean> {
  return RNMaio.isAdvertisingReady();
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
