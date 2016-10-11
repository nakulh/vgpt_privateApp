// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'update.controller', 'qa.controller', 'videos.controller', 'leaderboard.controller', 'bookmark.controller', 'test.controller'])

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
    var dbDel = function(date){
      var query = "DELETE FROM timeWiseStats WHERE date = ?";
      $cordovaSQLite.execute(db, query, [date]).then(function(res){
        console.log(res.insertId);
      }, function(err){
        console.log(err.message);
      });
    };
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS timeWiseStats (score Int, date text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (firstname text, lastname text, deviceId text, admnNo text, accessMethod text, pointsTotal Int DEFAULT 0, pointsCurrent Int DEFAULT 0, level Int DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsQuestions (chapter text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryQuestions (chapter text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsQuestions (chapter text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, supportMaterial text, id Int, deviceLink text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaLevels (subject text, chapter text, topic text, level Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS questionBookmarks (subject text, chapter text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaSubjectStats (subject text, points Int DEFAULT 0, totalCorrect Int DEFAULT 0, totalWrong Int DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaTopicStats (topic text, points Int DEFAULT 0, totalCorrect Int DEFAULT 0, totalWrong Int DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS testsInfo (taken Bit, date text, password text, name text, subjects text, time Int, elapsedTime Int, correct Int, wrong Int, score Int, uploaded Bit)");
    $cordovaSQLite.execute(db, "SELECT * FROM timeWiseStats").then(function(res){
      if(res.rows.length > 0){
        var rawDate = new Date();
        var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
        for(var x = 0; x < res.row.length; x++){
          var someDay = new Date(String(res.row.item(x).date));
          var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if(diffDays >= 30){
            dbDel(res.row.item(x).date);
          }
        }
      }
      else{
        console.log("nothing in time wise stats");
      }
    }, function(err){
      console.log(err.message);
    });
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

  .state('app.qaStats', {
    url: '/qa/stats',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaStats.html',
        controller: 'QaStatsCtrl'
      }
    }
  })

  .state('app.qaDir', {
    url: '/qa/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaDirectorySubject.html',
        controller: 'QaDirectoryCtrl'
      }
    }
  })

  .state('app.qaGame', {
    url: '/qa/game/:subject/:chapter',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaGame.html',
        controller: 'QaGameCtrl'
      }
    }
  })

  .state('app.qaGameEnd', {
    url: '/qa/game/end',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaEnd.html',
        controller: 'QaEndCtrl'
      }
    }
  })

  .state('app.videos', {
    url: '/videos',
    views: {
      'menuContent': {
        templateUrl: 'templates/videos.html',
        controller: 'VideosCtrl'
      }
    }
  })

  .state('app.videosDir', {
    url: '/videos/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/videosDir.html',
        controller: 'VideosDirCtrl'
      }
    }
  })

  .state('app.videosSubDir', {
    url: '/videos/:subject/:chapter/',
    views: {
      'menuContent': {
        templateUrl: 'templates/videosSubDir.html',
        controller: 'VideosSubDirCtrl'
      }
    }
  })

  .state('app.videosSubDirVideo', {
    url: '/videos/:subject/:video',
    views: {
      'menuContent': {
        templateUrl: 'templates/video.html',
        controller: 'VideoCtrl'
      }
    }
  })

  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'BookmarkCtrl'
      }
    }
  })

  .state('app.leaderboard', {
    url: '/leaderboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/leaderboard.html',
        controller: 'LeaderboardCtrl'
      }
    }
  })

  .state('app.testList', {
    url: '/testlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/testList.html',
        controller: 'TestListCtrl'
      }
    }
  })

  .state('app.testOverview', {
    url: '/testlist/:password',
    views: {
      'menuContent': {
        templateUrl: 'templates/testOverview.html',
        controller: 'TestOverviewCtrl'
      }
    }
  })

  .state('app.testQuestion', {
    url: '/testlist/:password/:subject/:question',
    views: {
      'menuContent': {
        templateUrl: 'templates/testQuestion.html',
        controller: 'TestQuestionCtrl'
      }
    }
  })

  .state('app.testEnd', {
    url: '/endTest',
    views: {
      'menuContent': {
        templateUrl: 'templates/testEnd.html',
        controller: 'TestEndCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/settings');
});
