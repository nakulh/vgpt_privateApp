var app = angular.module('videos.controller', ['db.service']);
var ip = "http://192.168.1.102:8080";
var resUrl = ip + "/Laravel/VGPT/resources/";
app.controller('VideosCtrl', function($scope){

});

app.controller('VideosDirCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topics = ["Modern Physics", "2", "3", "4"];
    $scope.topicLinks = ["modern_physics", "2", "3", "4"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  else if($stateParams.subject == "maths"){
    $scope.topics = ["Quadratic equation", "Binomial Theorem", "Probability", "Integration"];
    $scope.topicLinks = ["quadratic_equation", "binomial_theorem", "probability", "integration"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('VideosSubDirCtrl', function($timeout, $scope, $stateParams, DbVideos, $cordovaFileOpener2, $cordovaFileTransfer, DbServiceSettings, $cordovaSQLite, $cordovaFile, $cordovaToast){
  DbVideos.getVideosList($stateParams.subject, $stateParams.topic).then(function(){
    $scope.videos = [];
    var Video = function(video){
      for(var key in video){
        console.log(key);
      }
      this.title = video.title;
      this.description = video.description;
      this.intranetLink = video.intranetLink;
      this.internetLink = video.internetLink;
      console.log(video.deviceLink);
      if(video.deviceLink){
        this.open = function(){
          var mime = "video/" + video.deviceLink.split(".").pop();
          $cordovaFileOpener2.open(
            video.deviceLink,
            mime
          ).then(function() {
              console.log("file opened");
          }, function(err) {
              console.log(err);
              var strBuilder = [];
              for(var key in err){
                    if (err.hasOwnProperty(key)) {
                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                  }
              }
              console.log(strBuilder.join(""));
          });
        };
        this.delete = function(){
          $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, video.deviceLink.split("/").pop())
            .then(function (success) {
              console.log('removed video file');
              DbVideos.removeVideo(DbVideos.videosList.item(x).id, $stateParams.subject);
            }, function (error) {
              console.log('error removing video file');
            });
        };
      }
      else{
        this.download = function(){
          DbServiceSettings.getUserInfo().then(function(res){
            if(res[3] == "intranet"){
              console.log("intranet");
              var trustHosts = true;
              var options = {};
              var filename = video.intranetLink.split("/").pop();
              var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
              $cordovaFileTransfer.download(resUrl + video.intranetLink, targetPath, options, trustHosts)
                .then(function(result) {
                  console.log("download complete from " + resUrl + video.intranetLink);
                  DbVideos.updateDeviceLink($stateParams.subject, targetPath, video.id);
                  video.deviceLink = targetPath;
                  this.open = function(){
                    var mime = "video/" + video.deviceLink.split(".").pop();
                    $cordovaFileOpener2.open(
                      video.deviceLink,
                      mime
                    ).then(function() {
                        console.log("file opened");
                    }, function(err) {
                        console.log(err);
                        var strBuilder = [];
                        for(var key in err){
                              if (err.hasOwnProperty(key)) {
                                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                            }
                        }
                        console.log(strBuilder.join(""));
                    });
                  };
                  this.delete = function(){
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, video.deviceLink.split("/").pop())
                      .then(function (success) {
                        console.log('removed video file');
                        DbVideos.removeVideo(DbVideos.videosList.item(x).id, $stateParams.subject);
                      }, function (error) {
                        console.log('error removing video file');
                      });
                  };
                }, function(err) {
                    console.log(err);
                }, function (progress) {
                  $timeout(function () {
                    console.log((progress.loaded / progress.total) * 100);
                  });
                });
            }
            else{
              console.log("internet");
              var trustHosts = true;
              var options = {};
              var filename = video.intranetLink.split("/").pop();
              var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
              $cordovaFileTransfer.download(video.intranetLink, targetPath, options, trustHosts)
                .then(function(result) {
                  console.log("download complete from " + url);
                  DbVideos.updateDeviceLink($stateParams.subject, targetPath, video.id);
                }, function(err) {
                    console.log(err);
                }, function (progress) {
                  $timeout(function () {
                    console.log((progress.loaded / progress.total) * 100);
                  });
                });
            }
          }, function(err){
            console.log(err);
          });
        };
      }
    };
    var dateToday = new Date();
    //var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    if(DbVideos.videosList.length >= 0){
      for(var x = 0; x < DbVideos.videosList.length; x++){
        if(DbVideos.videosList.item(x).downloadDate){
          var someDay = new Date(String(DbVideos.videosList.item(x).downloadDate));
          var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if(diffDays >= 30){
            $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, DbVideos.videosList.item(x).deviceLink.split("/").pop())
              .then(function (success) {
                console.log('removed video file');
                DbVideos.removeVideo(DbVideos.videosList.item(x).id, $stateParams.subject);
              }, function (error) {
                console.log('error removing video file');
              });
          }
        }
        $scope.videos.push(new Video(DbVideos.videosList.item(x)));
      }
    }
    else{
      $cordovaToast
        .show('No videos in this category yet', 'long', 'center');
    }
    console.log("got videos");
  }, function(err){
    $scope.videos = [];
    console.log("error getting videos");
  });
});
