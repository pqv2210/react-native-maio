package com.reactnativemaio;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import jp.maio.sdk.android.FailNotificationReason;
import jp.maio.sdk.android.MaioAds;
import jp.maio.sdk.android.MaioAdsListener;

public class RNMaioModule extends ReactContextBaseJavaModule {
  public static final String NAME = "Maio";
  private final ReactApplicationContext reactContext;

  public RNMaioModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "RNMaio";
  }

  private final static String TYPE = "type";
  private final static String SKIPPED = "skipped";
  private final static String INITIALIZED = "initialized";
  private final static String OPENED = "opened";
  private final static String STARTED = "started";
  private final static String FINISHED = "finished";
  private final static String CLOSED = "closed";
  private final static String ERROR = "error";

  private void onSentEvent(String eventType) {
    final WritableMap eventMap = new WritableNativeMap();
    eventMap.putString(TYPE, eventType);
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(NAME, eventMap);
  }

  private String getError(FailNotificationReason reason) {
    switch (reason) {
      case AD_STOCK_OUT:
        return "Ad stock out";
      case RESPONSE:
        return "Response from Server error";
      case NETWORK_NOT_READY:
        return "Network Client";
      case NETWORK:
        return "Network Server";
      case VIDEO:
        return "Video Playback";
      default:
        return "Unknown";
    }
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Required for addListener.
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Required for addListener.
  }

  @Override
  public void initialize() {
    super.initialize();
    try {
      Activity currentActivity = getCurrentActivity();
      MaioAds.setAdTestMode(BuildConfig.DEBUG);
      ApplicationInfo ai = reactContext.getPackageManager().getApplicationInfo(reactContext.getPackageName(), PackageManager.GET_META_DATA);
      Bundle bundle = ai.metaData;
      String mediaEID = bundle.getString("com.rnmaio.media_eid");
      MaioAds.init(currentActivity, mediaEID, new MaioAdsListener() {
        @Override
        public void onInitialized() {
          onSentEvent(INITIALIZED);
        }

        @Override
        public void onOpenAd(String zoneId) {
          onSentEvent(OPENED);
        }

        @Override
        public void onStartedAd(String zoneId) {
          onSentEvent(STARTED);
        }

        @Override
        public void onFinishedAd(int playtime, boolean skipped, int duration, String zoneEid) {
          final WritableMap eventMap = new WritableNativeMap();
          eventMap.putString(TYPE, FINISHED);
          eventMap.putBoolean(SKIPPED, skipped);
          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(NAME, eventMap);
        }

        @Override
        public void onClosedAd(String zoneEid) {
          onSentEvent(CLOSED);
        }

        @Override
        public void onFailed(FailNotificationReason reason, String zoneEid) {
          String error = getError(reason);
          final WritableMap eventMap = new WritableNativeMap();
          eventMap.putString(TYPE, ERROR);
          eventMap.putString(ERROR, error);
          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(NAME, eventMap);
        }
      });
    } catch (Exception e) {
      Log.d("", "");
    }
  }

  @ReactMethod
  public void isAdvertisingReady(Callback callback) {
    callback.invoke(MaioAds.canShow());
  }

  @ReactMethod
  public void onShowAdvertising() {
    MaioAds.show();
  }

  @ReactMethod
  public void onCheckAndShowAdvertising() {
    if (MaioAds.canShow()) {
      MaioAds.show();
    }
  }
}
