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

