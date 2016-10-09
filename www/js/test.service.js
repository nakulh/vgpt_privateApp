var app = angular.module('test.service', []);
app.factory('TestUpdate', function($q, $http, $cordovaSQLite){
  var self = {};
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  var printQuestion = function(res){
    console.log("inserted a question for test");
  };
  self.insertTest = function(){
    $http.get('./js/testReq.json').success(function(test){
      var subjects = test.subjects.toString();
      var testArr = [0, test.date, test.password, test.name, subjects, test.time, 0, 0, 0, 0, 0];
      var query = "INSERT INTO testsInfo (taken, date, password, name, subjects, time, elapsedTime, correct, wrong, score, uploaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      $cordovaSQLite.execute(db, query, testArr).then(function(res){
        console.log("inserted test info");
        console.log(res.indertId);
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS " + test.password + " (subject text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, marks Int)")
          .then(function(res){
            console.log("created table " + test.password);
            for(var x in test.subjects){
              console.log(test.subjects[x]);
              questionsArr = test[test.subjects[x]];
              for(var y in questionsArr){
                console.log(y);
                var q = questionsArr[y];
                query = "INSERT INTO " + test.password + " (subject, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, marks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var ans = q.answer.toString();
                $cordovaSQLite.execute(db, query, [test.subjects[x], q.question, q.questionImage, q.a, q.aImg, q.b, q.bImg, q.c, q.cImg, q.d, q.dImg, q.ans, q.marks]).then(printQuestion(res));
              }
            }
          }, function(err){
            console.log(err.message);
          });
      }, function(err){
        console.log(err.message);
      });
    });
  };
  return self;
});
