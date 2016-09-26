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

app.controller('QaGameCtrl', function($scope, $stateParams, DbQuestions, QaStorage, $location){
  var Question = function(q){
    this.quesiton = q.question;
    this.questionImage = q.questionImage;
    this.a = q.A;
    this.b = q.B;
    this.c = q.C;
    this.d = q.D;
    this.aimg = q.AImg;
    this.bimg = q.BImg;
    this.cimg = q.CImg;
    this.dimg = q.DImg;
    this.answer = q.answer;
    this.wrong = q.wrong;
  };
  DbQuestions.getQuestions($stateParams.subject, $stateParams.chapter).then(function(){
    console.log("got back");
    console.log(DbQuestions.questions);
    $scope.cards = [];
    for(var x = 0; x < DbQuestions.questions.length; x++){
      $scope.cards.push(new Question(DbQuestions.questions.item(x)));
    }
    switch(DbQuestions.level){
      case 0:
        for(x = 0; x < DbQuestions.questions.length; x++){
          $scope.cards[x].timing = 3*60*1000;
          $scope.cards[x].ppoints = $scope.cards[x].wrong > 0 ? 5 : 10;
          $scope.cards[x].npoints = -2;
        }
        console.log("set lvl 0");
        break;
      case 1:
        for(x = 0; x < DbQuestions.questions.length; x++){
          $scope.cards[x].timing = 5*60*1000;
          $scope.cards[x].ppoints = $scope.cards[x].wrong > 0 ? 10 : 25;
          $scope.cards[x].npoints = -5;
        }
        console.log("set lvl 1");
        break;
      case 2:
        for(x = 0; x < DbQuestions.questions.length; x++){
          $scope.cards[x].timing = 10*60*1000;
          $scope.cards[x].ppoints = $scope.cards[x].wrong > 0 ? 50 : 100;
          $scope.cards[x].npoints = -25;
        }
        console.log("set lvl 2");
        break;
      case 3:
        for(x = 0; x < DbQuestions.questions.length; x++){
          $scope.cards[x].timing = 15*60*1000;
          $scope.cards[x].ppoints = $scope.cards[x].wrong > 0 ? 300 : 500;
          $scope.cards[x].npoints = -200;
        }
        console.log("set lvl 3");
        break;
      default:
        console.log("error in points config");
        break;
    }
    $scope.cards.push({
      question: "end"
    });
    var userAns = [];
    $scope.userAns = function(ans){
      userAns.push(ans);
    };
    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };
    $scope.cardSwiped = function(index) {
      var newCard = // new card data
      $scope.cards.push(newCard);
    };
    $scope.end = function(){
      console.log("ending game");
      QaStorage.storeQuestions($scope.cards, DbQuestions.level);
      $location.path("#/app/qa/game/end");
    };
  });
});

app.controller('QaEndCtrl', function($scope, QaStorage){
  $scope.questions = QaStorage.getQuestions;
});
