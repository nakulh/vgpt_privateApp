var app = angular.module('update.service', ['db.service']);
app.factory('UpdateService', function($q, $http, DbServiceSettings, $cordovaFileTransfer, $cordovaFile, DbItemAdd){
  var self = {};
  var random = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  self.checkUpdates = function(){
    var d = $q.defer();
    DbServiceSettings.getUserInfo().then(function(userInfo){
      var user = {
        firstname: userInfo[0],
        lastname: userInfo[1],
        admnNo: userInfo[2]
      };
      console.log(user);
      var url = "";
      if(userInfo[3] == "intranet"){
        url = "someIp";
      }
      else{
        url = "someURL";
      }
      $http.get('./js/updateReply.json').then(function(reply){
        angular.forEach(reply, function(item, index){
          if(item.type == "question"){
            DbItemAdd.addQuestion(item).then(function(success){
              console.log("question Added");
            });
          }
          else if(item.type == "video"){
            DbItemAdd.addVideo(item).then(function(success){
              console.log("video Added");
            });
          }
          else if(item.type == "studyMaterial"){
            DbItemAdd.addStudyMaterial(item).then(function(success){
              console.log("question Added");
            });
          }
        });
        d.resolve(reply);
      }, function(err){
        console.log(err);
        d.reject();
      });
    }, function(err){
      console.log(err);
    });
    return d.promise;
  };
  self.downloadUpdate = function(url, type){
    var d = $q.defer;
    if(type == "question"){
      $http.get(url).then(function(data){
        // TODO:
      });
    }
    else{
      var randomId = random();
      var targetPath = cordova.file.externalDataDirectory + randomId + ".zip";
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function(result) {
          console.log("success Download");
          $cordovaZip.unzip(targetPath, cordova.file.externalDataDirectory).then(function(){
            console.log('success Unzip');
            $cordovaFile.removeFile(cordova.file.externalDataDirectory, randomId + ".zip").then(function(success){
              console.log("deleted ZIP");
              d.resolve();
            });
          }, function () {
              console.log('error unzip');
             }, function (progressEvent) {
                self.unzipProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                });
      }, function(err) {
        console.log(err);
        console.log("error Downloading");
      }, function (progress) {
        $timeout(function () {
          self.downloadProgress = Math.round((progress.loaded / progress.total) * 100);
        });
      });
    }
    return d.promise;
  };
  return self;
});
