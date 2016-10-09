var app = angular.module('test.controller', ['db.service', 'test.service']);
app.controller('TestListCtrl', function($scope, DbTest, TestUpdate, $location){
  $scope.submit = function(code){
    DbTest.checkCode(code).then(function(res){
      if(res){
        console.log("correct test code redirecting......");
        var path = "/app/testlist/" + code;
        $location.path(path);
      }
      else{
        $scope.message = "incorrect password!";
      }
    });
  };
  $scope.insertTest = function(){
    TestUpdate.insertTest();
  };
});

app.controller('TestOverviewCtrl', function($scope, $stateParams, DbTest){
  DbTest.getTest($stateParams.password).then(function(test){
    var subjects = [];
    var questions = [];
    questions.push([]);
    subjects.push(test.item(0).subject);
    var qIndex = 0;
    var num = 1;
    for(var x = 0; x < test.length; x++){
      if(subjects.indexOf(test.item(x).subject) < 0){
        subjects.push(test.item(x).subject);
        qIndex++;
        questions.push([]);
        num = 1;
      }
      var q = test.item(x);
      q.review = false;
      q.answered = false;
      q.num = num;
      num++;
      questions[qIndex].push(q);
    }
    $scope.subjects = subjects;
    $scope.questions = questions;
    console.log(subjects[0] + subjects[1]);
  });
});

app.controller('TestQuestionCtrl', function($scope){

});

app.controller('TestEndCtrl', function($scope){

});
