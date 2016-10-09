var app = angular.module('leaderboard.controller', ['db.service', 'leaderboard.service']);
app.controller('LeaderboardCtrl', function($scope, DbLeaderboard, DbServiceSettings, Ranks){
  $scope.dayRanks = [];
  $scope.weekRanks = [];
  $scope.monthRanks = [];
  DbLeaderboard.getScoreData().then(function(res){
    DbServiceSettings.getUserInfo().then(function(user){
      console.log("got user data");
      Ranks.getYourRank(user).then(function(ranks){
        $scope.dayRank = ranks.dayRank;
        $scope.weekRank = ranks.weekRank;
        $scope.monthRank = ranks.monthRank;
      }, function(err){
        console.log(err);
      });
    }, function(err){
      console.log(err);
    });
  });
  $scope.loadDay = function(){
    var low = $scope.dayRanks.length + 1;
    var high = low + 10;
    Ranks.getPublicRanks(low, high, 1).then(function(ranks){
        $scope.dayRanks = $scope.dayRanks.concat(ranks);
    });
  };
  $scope.loadWeek = function(){
    var low = $scope.weekRanks.length + 1;
    var high = low + 10;
    Ranks.getPublicRanks(low, high, 7).then(function(ranks){
        $scope.weekRanks = $scope.weekRanks.concat(ranks);
    });
  };
  $scope.loadMonth = function(){
    var low = $scope.monthRanks.length + 1;
    var high = low + 10;
    Ranks.getPublicRanks(low, high, 30).then(function(ranks){
        $scope.monthRanks = $scope.monthRanks.concat(ranks);
    });
  };
  $scope.loadDay();
  $scope.loadWeek();
  $scope.loadMonth();
});
