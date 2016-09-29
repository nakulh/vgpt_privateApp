var app = angular.module('bookmark.controller', ['db.service']);
app.controller('BookmarkCtrl', function($scope, DbBookmarks){
  DbBookmarks.getBookmarks().then(function(){
    $scope.bookmarks = DbBookmarks.bookmarks;
  });
  $scope.delete = DbBookmarks.deleteBookmark(question).then(function(){
    console.log("deleted : " + question);
  });
});
