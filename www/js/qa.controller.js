var app = angular.module('qa.controller', ['db.service', 'qa.service']);
app.controller('QaCtrl', function($scope){

});

app.controller('QaDirectoryCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topics = ["Electrostatics", "modern_physics", "mechanics"];
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

app.controller('QaGameCtrl', function($scope, $stateParams, DbQuestions, QaStorage, $state, $timeout){
  var Question = function(q){
    this.subject = $stateParams.subject;
    this.question = q.question;
    this.questionImage = q.questionImage;
    this.a = q.A;
    this.b = q.B;
    this.c = q.C;
    this.d = q.D;
    this.AImg = q.AImg;
    this.BImg = q.BImg;
    this.CImg = q.CImg;
    this.DImg = q.DImg;
    this.answer = q.answer;
    this.wrong = q.wrong;
    this.level = DbQuestions.level;
  };
  DbQuestions.getQuestions($stateParams.subject, $stateParams.chapter).then(function(){ //Get questions from db
    console.log("got back");
    var cards = [];
    for(var x = 0; x < DbQuestions.questions.length; x++){
      cards.push(new Question(DbQuestions.questions.item(x)));
    }
    switch(DbQuestions.level){
      case 0:
        for(x = 0; x < DbQuestions.questions.length; x++){
          cards[x].timing = 3*6*1000;
          cards[x].ppoints = cards[x].wrong > 0 ? 5 : 10;
          cards[x].npoints = -2;
        }
        console.log("set lvl 0");
        break;
      case 1:
        for(x = 0; x < DbQuestions.questions.length; x++){
          cards[x].timing = 5*60*1000;
          cards[x].ppoints = cards[x].wrong > 0 ? 10 : 25;
          cards[x].npoints = -5;
        }
        console.log("set lvl 1");
        break;
      case 2:
        for(x = 0; x < DbQuestions.questions.length; x++){
          cards[x].timing = 10*60*1000;
          cards[x].ppoints = cards[x].wrong > 0 ? 50 : 100;
          cards[x].npoints = -25;
        }
        console.log("set lvl 2");
        break;
      case 3:
        for(x = 0; x < DbQuestions.questions.length; x++){
          cards[x].timing = 15*60*1000;
          cards[x].ppoints = cards[x].wrong > 0 ? 300 : 500;
          cards[x].npoints = -200;
        }
        console.log("set lvl 3");
        break;
      default:
        console.log("error in points config");
        break;
    }
    $scope.totalCards = cards.length;
    $scope.counter = 0;
    $scope.card = cards[$scope.counter];

    var timeout = $timeout(function(){
      $scope.next(false);
      console.log("timeout");
    }, $scope.card.timing);
    $scope.card.timing /= 1000;
    var timer = setInterval(function(){
      $scope.card.timing -= 1;
      $scope.$apply();
    }, 1000);

    $scope.next = function(userAns){
      $timeout.cancel(timeout);
      clearInterval(timer);
      $scope.card = cards[++$scope.counter];
      cards[$scope.counter-1].userAns = userAns;
      $scope.userAns = false;
      timeout = $timeout(function(){
        if($scope.counter < DbQuestions.questions.length - 1){
          $scope.next(false);
        }
        else {
          $scope.end(false);
        }
        console.log("timeout");
      }, $scope.card.timing);
      $scope.card.timing /= 1000;
      timer = setInterval(function(){
        $scope.card.timing -= 1;
        $scope.$apply();
      }, 1000);
    };

    $scope.end = function(userAns){
      console.log("ending game");
      cards[$scope.counter].userAns = userAns;
      QaStorage.storeQuestions(cards, DbQuestions.level);
      $state.go('app.qaGameEnd');
    };
    $scope.bookmark = function(){
      DbQuestions.bookmark(cards[$scope.counter]).then(function(bookmarked){
        console.log(bookmarked);
      });
    };
  });
});

app.controller('QaEndCtrl', function($scope, QaStorage, DbQuestions){
  $scope.questions = QaStorage.q;
  $scope.correct = 0;
  $scope.wrong = 0;
  $scope.points = 0;
  var skip = 0, wrongQuestions = [], wrongArr = [];

  //Specify the -ve marking for no answers
  switch (QaStorage.level) {
    case 0:
      skip = -1;
      break;
    case 1:
      skip = -2;
      break;
    case 2:
      skip = -10;
      break;
    case 3:
      skip = -50;
      break;
    case 4:
      skip = -100;
      break;
    default:
      console.log("error in level (skip marking)");
  }
  for(var x = 0; x < QaStorage.q.length; x++){
    if(QaStorage.q[x].answer == QaStorage.q[x].userAns){
      $scope.correct++;
      $scope.points += QaStorage.q[x].ppoints;
    }
    else {
      $scope.wrong++;
      wrongArr.push(++QaStorage.q[x].wrong);
      $scope.points += QaStorage.q[x].userAns ? QaStorage.q[x].npoints : skip;
      wrongQuestions.push(QaStorage.q[x].question);
    }
  }
  $scope.levelUp = false;
  $scope.levelDown = false;
  console.log("correct " + $scope.correct);
  console.log("wrong " + $scope.wrong);
  console.log("points " + $scope.points);
  switch (QaStorage.level) {
    case 0:
      if($scope.correct == QaStorage.q.length){
        $scope.levelUp = true;
      }
      break;
    case 1:
      if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 3){
        for(x = 3; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-3].userAns != QaStorage.q[x-3].answer && QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }
      break;
    case 2:
      if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }
      break;
    case 3:
      if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }
      break;
    case 4:
      if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }
      break;
    default:
      console.log("level detection error");
  }
  $scope.levelUp = ($scope.levelDown && $scope.levelUp) ? false : true;
  /*if($scope.levelUp){
    DbQuestions.changeLevel(++QaStorage.level).then(function(result){
      console.log("changed level");
      console.log("level up = " + $scope.levelUp);
      console.log("level down = " + $scope.levelDown);
    });
  }
  else if($scope.levelDown){
    DbQuestions.changeLevel(--QaStorage.level).then(function(result){
      console.log("changed level");
      console.log("level up = " + $scope.levelUp);
      console.log("level down = " + $scope.levelDown);
    });
  }*/
  if(wrongQuestions.length)
    DbQuestions.addWrong(wrongQuestions, wrongArr, QaStorage.q[0].subject);
});
