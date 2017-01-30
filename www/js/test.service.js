var app = angular.module('test.service', ['db.service']);
var ip = "http://192.168.1.10:8080";
var url = ip + "/Laravel/VGPT/public/api/v1/test/batch";
app.factory('TestUpdate', function($q, $http, $cordovaSQLite, DbServiceSettings, $cordovaFileTransfer){
  var userObj = {};
  DbServiceSettings.getUserInfo().then(function(user){
    userObj = {
      batch: user[4],
      no: 0
    };
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    $cordovaSQLite.execute(db, "SELECT count(*) FROM testsInfo").then(function(count){
      userObj.no = count.rows.item(0)['count(*)'];
      console.log("batch " + userObj.batch);
      console.log("no = " + userObj.no);
    }, function(err){
      console.log(err.message);
    });
  });
  var self = {};
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  var test;
  var toParams = function(obj) {
      var p = [];
      for (var key in obj) {
          p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
  };
  var downloadImage = function(url){
    url = "http://192.168.1.10:8080/Laravel/VGPT/resources/" + url;
    var trustHosts = true;
    var options = {};
    var filename = url.split("/").pop();
    //console.log("filename = " + filename);
    var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        console.log("download complete from " + url);
        self.downloading = false;
      }, function(err) {
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      }, function (progress) {
        $timeout(function () {
          console.log((progress.loaded / progress.total) * 100);
          self.downloading = true;
        });
      });
  };
  self.insertTest = function(){
    console.log("begin test update sequence");
    console.log(url);
    var testInsertion = function(res){
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
              if(q.qImgUrl.length > 4){
                downloadImage(q.qImgUrl);
                var filename = q.qImgUrl.split("/").pop();
                q.qImgUrl = cordova.file.externalApplicationStorageDirectory + filename;
                console.log(q.qImgUrl);
              }
              else{
                q.qImgUrl = 0;
              }
              $cordovaSQLite.execute(db, query, [test.subjects[x], q.question, q.qImgUrl, q.a, q.aImgUrl, q.b, q.bImgUrl, q.c, q.cImgUrl, q.d, q.dImgUrl, ans, q.marks, q.negativeMarks, q.type.toLowerCase()]).then(function(res){
                console.log("inserted question");
              }, function(err){
                console.log(err.message);
              });
            }
          }
        }, function(err){
          console.log(err.message);
        });
    };
    $http({
      url: url,
      method: "POST",
      data: toParams(userObj),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(tests){
      console.log("got reply");
      console.log(tests.length);
      for(var t = 0; t < tests.length; t++){
        test = tests[t];
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
        $cordovaSQLite.execute(db, query, testArr).then(testInsertion,
          /*function(res){
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
                  $cordovaSQLite.execute(db, query, [test.subjects[x], q.question, q.qImgUrl, q.a, q.aImgUrl, q.b, q.bImgUrl, q.c, q.cImgUrl, q.d, q.dImgUrl, ans, q.marks, q.negativeMarks, q.type.toLowerCase()]).then(function(res){
                    console.log("inserted question");
                  }, function(err){
                    console.log(err.message);
                  });
                }
              }
            }, function(err){
              console.log(err.message);
            });
        }*/function(err){
          console.log(err.message);
        });
      }
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
