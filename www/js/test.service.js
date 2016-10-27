var app = angular.module('test.service', []);
var ip = "http://192.168.1.102:8080";
app.factory('TestUpdate', function($q, $http, $cordovaSQLite){
  var self = {};
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self.insertTest = function(){
    $http.get(ip + "/Laravel/VGPT/public/api/v1/test/view").success(function(test){
      var subjects = "";
      for(var x = 0; x < test.subjects.length; x++){
        subjects += test.subjects[x].subject.toLowerCase() + ",";
      }
      subjects = subjects.slice(0, -1);
      console.log(subjects);
      test.subjects = subjects.split(",");
      //var subjects = test.subjects.toString();
      var testArr = [0, test.date, test.password, test.name, subjects, test.time, 0, 0, 0, 0, 0];
      var query = "INSERT INTO testsInfo (taken, date, password, name, subjects, time, elapsedTime, correct, wrong, score, uploaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      $cordovaSQLite.execute(db, query, testArr).then(function(res){
        console.log("inserted test info");
        console.log(res.insertId);
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS " + test.password + " (subject text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, marks Int, negativeMarks Int, type text)")
          .then(function(res){
            console.log("created table " + test.password);
            for(var x in test.subjects){
              console.log(test.subjects[x]);
              questionsArr = test[test.subjects[x]];
              for(var y in questionsArr){
                console.log(y);
                var q = questionsArr[y];
                query = "INSERT INTO " + test.password + " (subject, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, marks, negativeMarks, type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var ans = q.answer.toString();
                $cordovaSQLite.execute(db, query, [test.subjects[x], q.question, q.qImgUrl, q.a, q.aImgUrl, q.b, q.bImgUrl, q.c, q.cImgUrl, q.d, q.dImgUrl, ans, q.marks, q.negativeMarks, q.type]).then(function(res){
                  console.log("inserted question");
                }, function(err){
                  console.log(err.message);
                });
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
app.factory('TestData', function($q){
  var self = {};
  self.storeData = function(q, s){
    self.questions = q;
    self.subjects = s;
  };
  self.dataPresent = function(){
    return self.questions;
  };
  self.storePassword = function(code){
    self.password = code;
  };
  return self;
});
