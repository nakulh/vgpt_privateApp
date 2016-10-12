var app = angular.module('test.controller', ['db.service', 'test.service']);
app.controller('TestListCtrl', function($scope, DbTest, TestUpdate, $location){
  $scope.submit = function(code){
    DbTest.checkCode(code).then(function(res){
      if(!res.taken){
        console.log("correct test code redirecting......");
        var path = "/app/testlist/" + code;
        $location.path(path);
      }
      else if(res.taken){
        $scope.message = "Test Already taken!";
      }
      else if(!res){
        $scope.message = "Incorrect Password";
      }
    });
  };
  $scope.insertTest = function(){
    TestUpdate.insertTest();
  };
});

app.controller('TestOverviewCtrl', function($scope, $stateParams, DbTest, TestData, $location, $rootScope){
  TestData.storePassword($stateParams.password);
  $scope.$on('$ionicView.enter', function() {
     console.log('Opened test overview!');
     if(TestData.dataPresent){
       $scope.questions = TestData.questions;
     }
  });
  $scope.password = $stateParams.password;
  DbTest.getTest($stateParams.password).then(function(test){
    console.log("getting test");
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
      q.userAns = null;
      q.num = num;
      num++;
      questions[qIndex].push(q);
    }
    $scope.subjects = subjects;
    $scope.questions = questions;
    TestData.storeData(questions, subjects);
  });
  var elapser = 0;
  //Code for Clock
  DbTest.getTestInfo($stateParams.password).then(function(testInfo){
    $rootScope.timeLeft = testInfo.time - testInfo.elapsedTime;
    elapser = $rootScope.timeLeft - 60000;
    $rootScope.timer = setInterval(function(){
      $rootScope.timeLeft -= 10000;
      $scope.$apply();
      if($rootScope.timeLeft <= 0){
        $location.path("/app/endTest");
        console.log("timeout");
        //clearInterval($rootScope.timer);
      }

      //store elapsedTime every 1 min
      if($rootScope.timeLeft < elapser){
        elapser -= 60000;
        DbTest.storeTimeElapsed($stateParams.password, testInfo.time - $rootScope.timeLeft);
      }
    }, 999);
  });
  //End code for clock

  $scope.openQuestion = function(subject, qNum){
    console.log(subject + qNum);
    var path = "/app/testlist/" + $stateParams.password + "/" + subject + "/" + qNum;
    $location.path(path);
  };
});

app.controller('TestQuestionCtrl', function($scope, $stateParams, TestData, $location, $ionicPopup, $rootScope){

  //Code for handling visibility of next & prev button
  if(TestData.subjects.indexOf($stateParams.subject) === 0 && $stateParams.question == 1){
    $scope.prevButton = false;
  }
  else{
    $scope.prevButton = true;
  }
  if(TestData.subjects.indexOf($stateParams.subject) == TestData.subjects.length-1 && $stateParams.question == TestData.questions[TestData.subjects.indexOf($stateParams.subject)].length){
    $scope.nextButton = false;
  }
  else{
    $scope.nextButton = true;
  }
  //END Code for handling visibility of next & prev button

  $scope.question = TestData.questions[TestData.subjects.indexOf($stateParams.subject)][$stateParams.question-1];
  var subject = $stateParams.subject;
  var questionNum = $stateParams.question-1;
  $scope.saveQuestion = function(userAns){
    console.log(userAns);
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].userAns = userAns;
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].answered = true;
    TestData.storeData(TestData.questions, TestData.subjects);
  };
  $scope.reviewLater = function(){
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].review = true;
    TestData.storeData(TestData.questions, TestData.subjects);
  };
  $scope.unsaveQuestion = function(){
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].userAns = null;
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].answered = false;
    TestData.storeData(TestData.questions, TestData.subjects);
  };

  //Code for handling prev & next button
  $scope.next = function(){
    $scope.prevButton = true;
    if($scope.question.num >= TestData.questions[TestData.subjects.indexOf(subject)].length){
        var s = TestData.subjects.indexOf(subject);
        s++;
        subject = TestData.subjects[s];
        $scope.question = TestData.questions[s][0];
        console.log(TestData.questions[s][0].question);
        questionNum = 0;
    }
    else{
      $scope.question = TestData.questions[TestData.subjects.indexOf(subject)][questionNum+1];
      questionNum++;
      console.log(TestData.questions[TestData.subjects.indexOf(subject)][questionNum].question);
    }
    if(TestData.subjects.indexOf(subject) == (TestData.questions.length-1) && (questionNum+1) == TestData.questions[TestData.subjects.indexOf(subject)].length){
      $scope.nextButton = false;
    }
    else{
      $scope.nextButton = true;
    }
  };
  $scope.previous = function(){
    $scope.nextButton = true;
    if($scope.question.num <= 1){
        var s = TestData.subjects.indexOf(subject);
        s--;
        subject = TestData.subjects[s];
        var q = TestData.questions[s].length - 1;
        $scope.question = TestData.questions[s][q];
        console.log(TestData.questions[s][q].question);
        questionNum = q;
    }
    else{
      $scope.question = TestData.questions[TestData.subjects.indexOf(subject)][questionNum-1];
      questionNum--;
      console.log(TestData.questions[TestData.subjects.indexOf(subject)][questionNum].question);
    }
    if(TestData.subjects.indexOf(subject) === 0 && questionNum === 0){
      $scope.prevButton = false;
    }
    else{
      $scope.prevButton = true;
    }
  };
  //END Code for handling prev & next button

  $scope.showConfirm = function() {
  var confirmPopup = $ionicPopup.confirm({
    title: 'End The Test?',
    template: 'Are you sure you want submit the test?'
  });

  confirmPopup.then(function(res) {
    if(res) {
      console.log('test submitted');
      end();
    } else {
      console.log('not submitted');
    }
  });
};
  var end = function(){
    var path = "/app/endTest";
    $location.path(path);
  };
});

app.controller('TestEndCtrl', function($scope, TestData, $rootScope, DbTest){
  clearInterval($rootScope.timer);
  var questions = TestData.questions;
  var marks = 0;
  var subjectMarks = [];
  var x = 0, y = 0;

  //Evaluate Test
  for(x = 0; x < questions.length; x++){
    subjectMarks.push(0);
    for(y = 0; y < questions[x].length; y++){
      if(questions[x][y].type == "single" && questions[x][y].userAns !== null){
        subjectMarks[x] += questions[x][y].answer == questions[x][y].userAns ? questions[x][y].marks : questions[x][y].negativeMarks;
      }
      else if(questions[x][y].type == "multiple" && questions[x][y].userAns && questions[x][y].userAns !== null){
        var userAns = questions[x][y].answer.split(",");
        var userAnsL = 0;
        var correct = true;
        if(questions[x][y].userAns.a){
          userAnsL++;
          if(userAns.indexOf("a") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.b){
          userAnsL++;
          if(userAns.indexOf("b") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.c){
          userAnsL++;
          if(userAns.indexOf("c") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.d){
          userAnsL++;
          if(userAns.indexOf("d") < 0){
            correct = false;
          }
        }
        if(userAnsL != userAns.length){
          correct = false;
        }
        subjectMarks[x] += correct ? questions[x][y].marks : questions[x][y].negativeMarks;
      }
      else if(questions[x][y].type == "integer" && questions[x][y].userAns !== null){
        subjectMarks[x] += questions[x][y].answer == questions[x][y].userAns ? questions[x][y].marks : questions[x][y].negativeMarks;
      }
    }
  }
//End Test Evaluater
  /*var a = 0, b = 0;
  for(a = 0; a < questions.length; a++){
    for(b = 0; b < questions[a].length; b++){
      //console.log("userAns " + questions[a][b].userAns);
      //console.log("answer " + questions[a][b].answer);
      var strBuilder = [];
      for(var key in questions[a][b]){
            if (questions[a][b].hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + questions[a][b][key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    }
  }*/
  $scope.marks = 0;
  for(x in subjectMarks){
    $scope.marks += subjectMarks[x];
  }
  DbTest.editStats(TestData.password, $scope.marks);
  $scope.subjectMarks = subjectMarks;
});
