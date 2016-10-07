var app = angular.module('leaderboard.service', []);
app.factory('Ranks', function($q, $http){
  var self = {};
  self.getYourRank = function(info){
    var d = $q.defer();
    console.log("give user ranks");
    var ranks = {
      dayRank: 12,
      weekRank: 56,
      monthRank: 89
    };
    d.resolve(ranks);
    //code for getting rank......
    return d.promise;
  };
  self.getPublicRanks = function(low, high, days){
    var d = $q.defer();
    console.log("give public ranks " + days);
    //code for public ranks......
    d.resolve([
      {
        username: "Goku",
        rank: 1,
        score: "over 999999"
      },
      {
        username: "Gohan",
        rank: 2,
        score: "over 999999"
      },
      {
        username: "Goten",
        rank: 2,
        score: "over 999999"
      },
    ]);
    return d.promise;
  };
  return self;
});
