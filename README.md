# React Native x Maio SDK

## Installation

Install package:
```
yarn add react-native-maio
```

### Linking

1. Auto link

```
react-native link react-native-maio
```

2. Manual link

<details close>
<summary>On iOS:</summary>
<br>
1. In XCode, in the project navigator, right click Libraries ➜ Add Files to [your project's name]<br>
2. Go to node_modules ➜ react-native-maio and add RNMaio.xcodeproj<br>
3. In XCode, in the project navigator, select your project. Add libRNMaio.a to your project's Build Phases ➜ Link Binary With Libraries<br>
4. Run your project
</details>

<details close>
<summary>On Android:</summary>
<br>
1. Open up `android/app/src/main/java/[...]/MainActivity.java`<br>
- Add import com.reactnativemaio.RNMaioPackage; to the imports at the top of the file<br>
- Add new RNMaioPackage() to the list returned by the getPackages() method<br>
2. Append the following lines to android/settings.gradle:<br>
<pre>
include ':react-native-maio'
project(':react-native-maio').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-maio/android')
</pre>
3. Insert the following lines inside the dependencies block in android/app/build.gradle:<br>
<pre>
implementation project(':react-native-maio')
</pre>
</details>

### Configure

1. iOS

- Open your Info.plist and add:
```
<key>SKAdNetworkItems</key>
<array>
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>v4nxqhlyqp.skadnetwork</string>
    </dict>
</array>
<key>MaioMediaEID</key>
<string>DemoMediaForIOS</string>
```

Replace `DemoMediaForIOS` by your Media ID from Maio console.

- Add MaioSDK to your `Podfile`:

```
target 'MyApp' do
  ...
  pod 'MaioSDK'
end
```

2. Android

Add in your `build.gradle`:
```
maven{
    url "https://imobile-maio.github.io/maven"
}
```

Add in your `app/build.gradle`:
```
dependencies {
    ...
    implementation 'com.google.android.gms:play-services-ads:+'
    ...
}
```

Open your AndroidManifest.xml:

```
<application>
    ...
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ApplicationID" />
    <meta-data
        android:name="com.rnmaio.media_eid"
        android:value="DemoPublisherMediaForAndroid" />
    <activity
      android:name="jp.maio.sdk.android.AdFullscreenActivity"
      android:configChanges="orientation|screenLayout|screenSize|smallestScreenSize"
      android:hardwareAccelerated="true"
      android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
    </activity>
    <activity
      android:name="jp.maio.sdk.android.HtmlBasedAdActivity"
      android:configChanges="keyboardHidden|orientation|screenSize|screenLayout"
      android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
    </activity>
</application>
```
Replace
- `ApplicationID` by your App ID(ca-app-pub-xxxxx~xxxxx) from Google ADMob console.
- `DemoPublisherMediaForAndroid` by your Media ID from Maio console.

### Usage

1. addMaioListener: Listen Maio's events

```
import { addMaioListener } from "react-native-maio"

...
React.useEffect(() => {
  addMaioListener((event: MaioEvent) => {
  switch (event.type) {
    case EventType.initialized:
      console.log("Maio Initialized with v" + event.version)
      break
    case EventType.opened:
    case EventType.started:
    case EventType.clicked:
    case EventType.closed:
    case EventType.finished:
      console.log('ADS finished with skipped = ', event.skipped);
      break
    case EventType.error:
      console.log(event.error)
      break
    }
  });
}, [])
...
```

2. isAdvertisingReady: Check ADS is ready or not
```
import { isAdvertisingReady } from "react-native-maio"

const isADSReady = await isAdvertisingReady()
```

3. onShowAdvertising: Show ADS
```
import { onShowAdvertising } from "react-native-maio"

onShowAdvertising()
```

4. onCheckAndShowAdvertising: if ADS ready, show it.
```
import { onCheckAndShowAdvertising } from "react-native-maio"

onCheckAndShowAdvertising()
```

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
