var app = angular.module('videos.controller', ['db.service']);
app.controller('VideosCtrl', function($scope){

});

app.controller('VideosDirCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  if($stateParams == "chemistry"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  if($stateParams == "maths"){
    $scope.topics = ["1", "2", "3", "4"];
    $scope.topicLinks = ["1", "2", "3", "4"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('VideosSubDirCtrl', function($scope, $stateParams, DbVideos){
  DbVideos.getVideosList($stateParams.subject, $stateParams.topic).then(function(){
    $scope.videos = DbVideos.videosList;
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
