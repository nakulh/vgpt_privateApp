// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'update.controller', 'qa.controller'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (firstname text, lastname text, deviceId text, admnNo text, accessMethod text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, onDevice Bit, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, onDevice Bit, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, onDevice Bit, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaStats (chapter text, topic text, stat text)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.update', {
    url: '/update',
    views: {
      'menuContent': {
        templateUrl: 'templates/update.html',
        controller: 'UpdateCtrl'
      }
    }
  })

  .state('app.qa', {
    url: '/qa',
    views: {
      'menuContent': {
        templateUrl: 'templates/qa.html',
        controller: 'QaCtrl'
      }
    }
  })

  .state('app.qa.directory', {
    url: '/qa/directory',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaDirectory.html',
        controller: 'QaDirectoryCtrl'
      }
    }
  })

  .state('app.qa.directory.subject', {
    url: '/qa/directory/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaDirectoryTopic.html',
        controller: 'QaDirectoryCtrl'
      }
    }
  })

  .state('app.qa.stats', {
    url: '/qa/stats',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaStats.html',
        controller: 'QaStatsCtrl'
      }
    }
  })

  .state('app.qa.game', {
    url: '/qa/game/:subject/:topic',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaGame.html',
        controller: 'QaGameCtrl'
      }
    }
  })

  .state('app.qa.game.end', {
    url: '/qa/game/end',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaEnd.html',
        controller: 'QaEndCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/settings');
});
