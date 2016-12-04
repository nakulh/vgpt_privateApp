var app = angular.module('bookmark.controller', ['db.service']);
app.controller('BookmarkCtrl', function($scope, DbBookmarks){
  console.log("bookmarks");
});

app.controller('BookmarkTopicsCtrl', function($scope, $stateParams){
  console.log($stateParams.subject);
  if($stateParams.subject == "maths"){
    $scope.topics = ["quadratic_eq", "diff", "integration"];
  }
  else if($stateParams.subject == "physics"){
    $scope.topics = ["modern_physics", "mechanics", "xyz"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topics = ["qwe", "dfg", "guk"];
  }
  for(var x =0; x < $scope.topics.length; x++){
    console.log($scope.topics[x]);
  }
  $scope.subject = $stateParams.subject;
});

app.controller('BookmarkListCtrl', function($scope, DbBookmarks, $stateParams, $rootScope, $location, $cordovaToast){
  $scope.bookmarks = [];
  DbBookmarks.getBookmarks($stateParams.topic).then(function(){
    if(!DbBookmarks.bookmarks.length){
      $cordovaToast.show('No bookmarks in ths category', 'long', 'center');
    }
    for(var x = 0; x < DbBookmarks.bookmarks.length; x++){
      $scope.bookmarks.push(DbBookmarks.bookmarks.item(x));
    }
  });
  $scope.delete = function(question){
    DbBookmarks.deleteBookmark(question).then(function(){
      console.log("deleted : " + question);
    });
  };
  $scope.showQuestion = function(question){
    $rootScope.question = question;
    var path = "/app/bookmarks/" + $stateParams.subject + "/" + $stateParams.topic + "/question";
    $location.path(path);
  };
});

app.controller('BookmarkQuestionCtrl', function($scope, DbBookmarks, $stateParams, $rootScope, $cordovaFileOpener2){
  $scope.question = $rootScope.question;
  $scope.openImg = function(link){
    $cordovaFileOpener2.open(
      link,
      "image/" + link.split(".").pop()
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
});
