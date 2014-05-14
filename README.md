## Ionic Iron IO ##

An iOS / Android app made with <a href="https://angularjs.org/">AngularJS</a> / <a href="http://ionicframework.com/docs/">Ionic</a> / <a href="http://phonegap.com/">Cordova</a> to support basic functionality with IronIO. 

made by @<a href="http://twitter.com/gregavola">gregavola</a>

## Getting Started ##

1. Install Ionic and Cordova (and NodeJS if you don't have it) - <code> npm install -g cordova ionic</code>
2. Run <code>ionic serve</code> to view the app in your browser.
3. Compile for native app using Cordova: <code>ionic platform add ios</code>
4. Add the in-app browser plugin <code>cordova plugin add org.apache.cordova.inappbrowser</code>
5. Then build the project - <code>ionic build ios</code>
4. Then simulate! <code>ionic emulate ios</code>

## Supported Tasks ##

The current application supports the following methods:

1. Viewing all your queues via IronMQ, include message counts (you can also click into them to see more detail on them)
2. Show all your active Codes via IronWorker (also click into see the actity of thoses tasks)
3. See Service Status for IronIO
4. Queue tasks to run in your selected "Codes" within IronWorker

## Building for Android on a Device ##

1. Via the command line in the IonicIronIO folder, run <code>ionic platform add android</code>
2. Then add the plugin files to in order to allow it to run <code>cordova plugin add org.apache.cordova.inappbrowser</code>
3. Then build the project: <code>ionic build android</code>
4. Open Eclipse, and make sure you are running ADT 22.6.2 or less.
5. Right click in the Project area and click "Import" or select File -> Import.
6. Select Android -> Existing Android Code <img src="http://f.cl.ly/items/2l0t1Y3M0511472E1h0C/Screen%20Shot%202014-05-14%20at%2012.00.50%20AM.png" />
7. Select the folder that was generated via the <code>ionic build android</code>, which should be in <code>PROJECTDIR/platforms/android</code>
8. It should request to add two projects, HelloWorld and HelloWorld-Cordova, click "OK"
9. Run as Android Application (you can choose emulate or device)

## Build for iOS in Xcode ##
1. Via the command line in the IonicIronIO folder, run <code>ionic platform add ios</code>
2. Then add the plugin files to in order to allow it to run <code>cordova plugin add org.apache.cordova.inappbrowser</code>, then <code>cordova plugin add org.apache.cordova.statusbar</code>
3. Then build the project: <code>ionic build ios</code>
4. Open the folder <code>PROJECTDIR/platform/ios</code>
5. Double click the <code>HelloCordova.xproj</code> to open in Xcode.
6. You can now deploy your emulator, or to your approved device.

## Tips ##

- You can change your package name in the config.xml file along with the version number. If you don't - the default settings will be added.
- You ***MUST*** run <code>ionic build android</code> or <code>ionic build ios</code> anytime you want to deploy changes. You will be making changes in <code>www/</code> and this command migrates your changes to the <code>platform</code> directory. If you don't run these commands - your code will be stale.
- Want to test your code first before building? Use <code>ionic serve</code> at the project root path to enable live auto-refreshing HTTP server of your app at <code>http://localhost:8100</code>. As you make changes to your code, it will automatically refresh the content.



