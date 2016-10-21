var app = angular.module('update.controller', ['update.service', 'db.service']);
app.controller('UpdateCtrl', function($scope, UpdateService, DbServiceSettings, DbItemAdd, $cordovaDevice, $cordovaSQLite, $http){
  $scope.checkQuestionUpdates = function(){
    var uuid = $cordovaDevice.getUUID();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = ?";
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
        url = "192.168.1.105:8080" + "/Laravel/VGPT/public/api/v1/question/view";
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/question/view";
      }
      url = "http://192.168.1.100:8080/Laravel/VGPT/public/api/v1/question/view";
      console.log(url);
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
          /*
          else if(item.type == "video"){
            console.log("video detected");
            DbItemAdd.addVideo(item).then(function(success){
              console.log("video Added");
            });
          }
          else if(item.type == "studyMaterial"){
            console.log("studyMaterial detected");
            DbItemAdd.addStudyMaterial(item).then(function(success){
              console.log("studyMaterial Added");
            });
          }
          */
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
        $scope.res = strBuilder.join("");
      });
    });
  };
  $scope.checkVideoUpdates = function(){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT * FROM user";
    $cordovaSQLite.execute(db, query).then(function(result){
      console.log("result");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
        }
      }
      var url = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        url = "localhost" + "/Laravel/VGPT/public/api/v1/video/view";
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/video/view";
      }
      url = "/video";
      console.log("getting JSON");
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
    $cordovaSQLite.execute(db, query).then(function(result){
      console.log("result");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
        }
      }
      var urld = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        urld = "localhost" + "/Laravel/VGPT/public/api/v1/dpp/batch/";
      }
      else{
        urld = "someURL" + "/Laravel/VGPT/public/api/v1/dpp/batch/";
      }
      urld = "/dpp";
      userObj = {
        batch: result.rows.item(0).batch,
        numberOfDpp: 0
      };
      console.log("getting JSON");
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
      $http.get(urld).success(function(res){
        for(var x = 0; x < res.length; x++){
          var filename = res[x].url.split("/").pop();
          var ext = filename.split(".").pop();
          console.log(filename);
          var url = res[x].url;
          var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
          downloadDpp(filename, ext, url, targetPath, res[x]);
        }
      }, function(err){
        console.log(err);
      });
    });
  };
});
