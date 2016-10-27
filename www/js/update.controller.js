var app = angular.module('update.controller', ['update.service', 'db.service']);
var ip = "http://192.168.1.102:8080";
var resUrl = ip + "/Laravel/VGPT/resources/";
app.controller('UpdateCtrl', function($scope, UpdateService, DbServiceSettings, DbItemAdd, $cordovaDevice, $timeout, $cordovaSQLite, $http, $cordovaFileTransfer){
  $scope.checkQuestionUpdates = function(){
    var count = 0;
    var uuid = $cordovaDevice.getUUID();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = ?";
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log("result");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
          console.log(result.rows.item(x).accessMethod);
        }
      }
      var url = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        url = ip + "/Laravel/VGPT/public/api/v1/question/view/" + count;
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/question/view";
      }
      console.log(url);
      console.log("sum count = " + count);
      $http.get(url).then(function(reply){
        console.log("got reply");
        console.log(reply);
        reply = reply.data.questions;
        angular.forEach(reply, function(item, index){
          console.log("item type --");
          console.log(item.type);
        //  console.log("question detected");
          DbItemAdd.addQuestion(item).then(function(success){
            console.log("question Added");
            $scope.res = "added q";
          });
        });
      }, function(err){
        console.log("error ques");
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
        //$scope.res = strBuilder.join("");
      });
    });
  };
  $scope.checkVideoUpdates = function(){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT * FROM user";
    var count = 0;
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, query).then(function(result){
      console.log("result db");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
        }
      }
      var url = "";
      console.log("count = " + count);
      if(result.rows.item(0).accessMethod == "intranet"){
        url = ip + "/Laravel/VGPT/public/api/v1/video/view/" + count;
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/video/view";
      }
      //url = "./js/video.json";
      console.log("getting JSON for vid from " + url);
      $http.get(url).success(function(reply){
        reply = reply.videos;
        angular.forEach(reply, function(item, index){
          console.log("item type --");
          console.log(item.type);
          console.log("video detected");
          DbItemAdd.addVideo(item).then(function(success){
            console.log("video Added");
          });
        });
      }, function(err){
        console.log(err);
      });
    });
  };
  $scope.checkDppUpdates = function(){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT * FROM user";
    var count = 0;
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, query).then(function(result){
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
        }
      }
      var urld = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        urld = ip + "/Laravel/VGPT/public/api/v1/dpp/view";
      }
      else{
        urld = "someURL" + "/Laravel/VGPT/public/api/v1/dpp/batch/";
      }
      userObj = {
        batch: result.rows.item(0).batch,
        numberOfDpp: 0
      };
      console.log(urld);
      console.log("getting JSON for dpp");
      var downloadDpp = function(filename, ext, url, targetPath, dpp){
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function(result) {
            console.log("download complete from " + url);
            addToDb(ext, targetPath, url, dpp);
          }, function(err) {
              console.log(err);
          }, function (progress) {
            $timeout(function () {
              console.log((progress.loaded / progress.total) * 100);
            });
          });
      };
      var addToDb = function(ext, targetPath, url, dpp){
        var query = "INSERT INTO " + dpp.subject + "Material (topic, intranetLink, title, description, id, deviceLink, fileType) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [dpp.topic, url, dpp.title, dpp.description, dpp.id, targetPath, ext]).then(function(res){
          console.log("added new dpp");
          console.log(res.insertId);
        }, function(err){
          console.log(err.message);
        });
      };
      $http.post(urld, {
        batch: result.rows.item(0).batch,
        no: count  }).success(function(res){
        var strBuilder = [];
        for(var key in res){
              if (res.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + res[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
        res = res.dpps;
        for(var x = 0; x < res.length; x++){
          var filename = res[x].URL.split("/").pop();
          var ext = filename.split(".").pop();
          console.log(filename);
          var url = resUrl + res[x].URL;
          var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
          downloadDpp(filename, ext, url, targetPath, res[x]);
        }
      }, function(err){
        console.log(err);
      });
    });
  };
});
