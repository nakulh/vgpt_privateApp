var app = angular.module('qa.service', []);
app.factory('QaStorage', function($q, $cordovaSQLite, $cordovaDevice){
  var self = {};
  self.storeQuestions = function(q, level){
    self.q = q;
    self.level = level;
  };
  self.getQuestions = function(){
    return [self.q, self.level];
  };
  return self;
});
