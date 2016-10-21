var app = angular.module('bookmark.controller', ['db.service']);
app.controller('BookmarkCtrl', function($scope, DbBookmarks){
  console.log("bookmarks");
});

app.controller('BookmarkTopicsCtrl', function($scope, $stateParams){
  if($stateParams.subject == "maths"){
    $scope.topics = ["quadratic_eq", "diff", "integration"];
  }
  else if($stateParams == "physics"){
    $scope.topics = ["modern_physics", "mechanics", "xyz"];
  }
  else if($stateParams == "chemistry"){
    $scope.topics = ["qwe", "dfg", "guk"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('BookmarkListCtrl', function($scope, DbBookmarks, $stateParams, $rootScope){
  $scope.bookmarks = [];
  DbBookmarks.getBookmarks($stateParams.topic).then(function(){
    for(var x = 0; x < DbBookmarks.bookmarks.length; x++){
      $scope.bookmarks.push(DbBookmarks.bookmarks.item(x));
    }
  });
  $scope.delete = DbBookmarks.deleteBookmark(question).then(function(){
    console.log("deleted : " + question);
  });
  $scope.showQuestion = function(question){
    $rootScope.question = question;
  };
});

app.controller('BookmarkQuestionCtrl', function($scope, DbBookmarks, $stateParams){
  $scope.question = $rootScope.question;
});
