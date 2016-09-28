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

app.controller('QaGameCtrl', function($scope, $stateParams, DbQuestions, QaStorage, $state){
  var Question = function(q){
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
          cards[x].timing = 3*60*1000;
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
    $scope.next = function(userAns){
      $scope.card = cards[++$scope.counter];
      cards[$scope.counter-1].userAns = userAns;
      $scope.userAns = false;
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

app.controller('QaEndCtrl', function($scope, QaStorage){
  $scope.questions = QaStorage.q;
});
