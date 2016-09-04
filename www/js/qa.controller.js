var app = angular.module('qa.controller', ['db.service']);
app.controller('QaCtrl', function($scope){

});

app.controller('QaDirectoryCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topics = ["Electrostatics", "Modern Physics", "Mechanics"];
  }
  if($stateParams.subject == "chemistry"){
    $scope.topics = ["Chemical Kinetics", "Organic", "Inorganic"];
  }
  if($stateParams.subject == "maths"){
    $scope.topics = ["Algebra", "Intergration", "Differentiation"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('QaStatsCtrl', function($scope){

});

app.controller('QaGameCtrl', function($scope, $stateParams, DbQuestions){
  DbQuestions.getQuestions($stateParams.subject, $stateParams.topic).then(function(){
    console.log(DbQuestions.questions);
  });
});

app.controller('QaEndCtrl', function($scope){
});
