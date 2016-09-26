var app = angular.module('videos.controller', ['db.service']);

app.controller('VideosCtrl', function($scope){

});

app.controller('VideosDirCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topics = ["modern Phy", "2", "3", "4"];
    $scope.topicLinks = ["modern_physics", "2", "3", "4"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  else if($stateParams.subject == "maths"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('VideosSubDirCtrl', function($scope, $stateParams, DbVideos){
  DbVideos.getVideosList($stateParams.subject, $stateParams.topic).then(function(){
    $scope.videos = {};
    $scope.videos.title = [];
    var x = 0;
    for(x = 0; x < DbVideos.videosList.length; x++){
      $scope.videos.title.push(DbVideos.videosList.item(x).title);
    }
    console.log("got videos");
    console.log($scope.videos);
  }, function(err){
    $scope.videos = [];
    console.log("error getting videos");
  });
});

app.controller('VideoCtrl', function($scope, DbVideos, $stateParams){
  DbVideos.getVideo($stateParams.subject, $stateParams.video).then(function(){

  });
});
