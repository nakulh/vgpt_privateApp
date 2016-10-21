// This contains (almmost) all the SQLite related functions used in the app

var db = null;
var app = angular.module('db.service', []);
app.factory('DbServiceSettings', function($q, $cordovaSQLite, $cordovaDevice){
  var self = {};
  //change access type: intranet or internet
  self.changeAccess = function(accessMethod){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var uuid = $cordovaDevice.getUUID();
    var d = $q.defer();
    var query  = "UPDATE user SET accessMethod = ? WHERE deviceId = ?";
    console.log(uuid);
    $cordovaSQLite.execute(db, query, [accessMethod, uuid]).then(function(result){
      d.resolve();
      console.log("insert id = " + result.insertId);
    }, function(error){
      d.reject();
      for(var e in error)
        console.log(error[e]);
      console.log("error");
    });
    return d.promise;
  };

  //Get basic user info
  self.getUserInfo = function(){
    var uuid = $cordovaDevice.getUUID();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var d  = $q.defer();
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = ?";
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log("got user info");
      console.log(result.rows.item(0).firstname);
      if(result.rows.length > 0){
          var res =  [result.rows.item(0).firstname, result.rows.item(0).lastname, result.rows.item(0).admnNo, result.rows.item(0).accessMethod];
          d.resolve(res);
      }
      else{
        d.reject();
      }
    }, function(err){
      console.log("err user info");
      console.log(err.message);
    });
    return d.promise;
  };

  return self;
});
app.factory('DbItemAdd', function($q, $cordovaSQLite, $cordovaFileTransfer, $timeout){
  var self = {};
  self.downloading = true;
  var downloadImage = function(url){
    url = "http://192.168.1.100:8080/Laravel/VGPT/resources/" + url;
    var trustHosts = true;
    var options = {};
    var filename = url.split("/").pop();
    console.log("filename = " + filename);
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
  self.addQuestion = function(question){
    console.log("start adding question");
    if(question.questionImageUrl){
      downloadImage(question.questionImageUrl);
    }
    if(question.aImageUrl){
      downloadImage(question.aImageUrl);
    }
    if(question.bImageUrl){
      downloadImage(question.bImageUrl);
    }
    if(question.cImageUrl){
      downloadImage(question.cImageUrl);
    }
    if(question.dImageUrl){
      downloadImage(question.dImageUrl);
    }
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: 'physicsQuestions',
      chemistry: 'chemistryQuestions',
      maths: 'mathsQuestions'
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[question.subject.toLowerCase()] + " (chapter, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [question.chapter, question.question, question.questionImage,
                                       question.a, question.aImg, question.b, question.bImg, question.c, question.cImg,
                                       question.d, question.dImg, question.answer, question.level, 0, question.id])
                                       .then(function(result){
                                          d.resolve();
                                          console.log("insert id = " + result.insertId);
                                        }, function(err){
                                          var strBuilder = [];
                                          for(var key in err){
                                                if (err.hasOwnProperty(key)) {
                                                   strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                              }
                                          }
                                          console.log(strBuilder.join(""));
                                        });
    return d.promise;
  };
  self.addVideo = function(video){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[video.subject.toLowerCase()] + " (chapter, topic, intranetLink, internetLink, title, description, id) VALUES (?, ?, ?, ?, ? ,? ,?)";
    $cordovaSQLite.execute(db, query, [video.chapter, video.topic, video.intranetLink, video.internetLink, video.title, video.description, video.id])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            }, function(err){
                              var strBuilder = [];
                              for(var key in err){
                                    if (err.hasOwnProperty(key)) {
                                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                  }
                              }
                              console.log(strBuilder.join(""));
                            });
    return d.promise;
  };
  /*self.addStudyMaterial = function(file){
    console.log("adding studyMaterial");
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsMaterial",
      chemistry: "chemistryMaterial",
      maths: "mathsMaterial"
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[file.subject] + " (chapter, intranetLink, internetLink, title, description, onDevice, id, deviceLink, fileType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [file.chapter, file.intranetLink, file.internetLink, file.title, file.description, 0, file.id, null, file.fileType])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            }, function(err){
                              var strBuilder = [];
                              for(var key in err){
                                    if (err.hasOwnProperty(key)) {
                                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                  }
                              }
                              console.log(strBuilder.join(""));
                            });
    return d.promise;
  };*/
  return self;
});

app.factory('DbQuestions', function($q, $cordovaSQLite){
  var self = {};
  self.getLevel = function(topic){
    var d = $q.defer();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT level from 'qaLevels' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
      d.resolve();
      if(reult.rows.length > 0){
        self.level = result.rows.item(0).level;
      }
      else{
        console.log("found no levels");
      }
    });
    return d.promise;
  };
  self.getQuestions = function(subject, chapter){
    var dbObj = {
      physics: "physicsQuestions",
      chemistry: "chemistryQuestions",
      maths: "mathsQuestions"
    };
    var d = $q.defer();
    self.level = 0;
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT level from 'qaLevels' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [chapter]).then(function(levelResult){
      if(levelResult.rows.length > 0){
        self.level = levelResult.rows.item(0).level;
        console.log("level = " + self.level);
      }
      else{
        console.log("found no levels");
      }
      query = "SELECT question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, wrong, id FROM physicsQuestions WHERE chapter = '" + chapter + "' AND level = " + self.level;
      console.log(query);
      $cordovaSQLite.execute(db, query).then(function(result){
        if(result.rows.length > 0){
          console.log(result.rows.length);  //result.rows.item(0).question
          self.questions = result.rows;
        }
        else{
          self.questions = false;
          console.log("no questions");
        }
        d.resolve();
      }, function(err){
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      });
    });
    return d.promise;
  };
  self.addWrong = function(questionsArr, wrongArr, subject){
    var dbObj = {
      physics: "physicsQuestions",
      chemistry: "chemistryQuestions",
      maths: "mathsQuestions"
    };
    var d = $q.defer();
    console.log("wronging " + wrongArr.length);
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    for(x = 0; x < wrongArr.length; x++){
      var query = "UPDATE " + dbObj[subject] + " SET wrong = " + wrongArr[x] + " WHERE question = ?";
      $cordovaSQLite.execute(db, query, [questionsArr[x]]).then(function(result){
        console.log(result.insertId);
      }, function(err){
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      });
    }
    d.resolve();
    console.log("wronged all");
    return d.promise;
  };
  self.editStats = function(){
    var d = $q.defer();

    return d.promise;
  };
  self.bookmark = function(q){
    var d = $q.defer();
    var insertArr = [q.subject, q.chapter, q.question, q.questionImage, q.A, q.AImg, q.B, q.BImg, q.C, q.CImg, q.D, q.DImg, q.answer, q.level, q.wrong];
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT question FROM questionBookmarks WHERE question = ?";
    $cordovaSQLite.execute(db, query, [q.question]).then(function(result){
      if(result.rows.length === 0){
        console.log("no similarities");
        query = "INSERT INTO questionBookmarks (subject, chapter, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, insertArr).then(function(res){
          console.log(res.insertId);
          d.resolve(true);
        }, function(err){
          var strBuilder = [];
          for(var key in err){
                if (err.hasOwnProperty(key)) {
                   strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
              }
          }
          console.log(strBuilder.join(""));
        });
      }
      else{
        console.log("already there");
        d.resolve(false);
      }
    }, function(err){
      var strBuilder = [];
      for(var key in err){
            if (err.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    });
    return d.promise;
  };
  self.changeLevel = function(level, topic){
    var d = $q.defer();
    var query = "UPDATE qaLevels SET level = ? WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [level, topic]).then(function(result){
      console.log("changed level to " + level);
    }, function(err){
      console.log(err.message);
    });
  };
  return self;
});

app.factory('DbBookmarks', function($q, $cordovaSQLite){
  var self = {};
  self.getBookmarks = function(topic){
    var d = $q.defer();
    var query = "SELECT * from questionBookmarks WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
        self.bookmarks = result.rows;
        d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.deleteBookmark = function(question){
    var d = $q.defer();
    var quesry = "DELETE FROM questionBookmarks WHERE question = ?";
    $cordovaSQLite.execute(db, query, [question]).then(function(result){
      console.log("deleted");
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});

app.factory('DbVideos', function($q, $cordovaSQLite){
  var self = {};
  //get full list of videos for specific topic/chapter
  self.getVideosList = function(subject, topic){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = $q.defer();
    self.videosList = [];
    var query = "SELECT chapter, topic, source, intranetLink, internetLink, title, description, deviceLink FROM '" + dbObj[subject] + "' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
      d.resolve();
      if(result.rows.length > 0){
        console.log(result.rows.length);
        self.videosList = result.rows;
      }
      else{
        console.log("no videos");
      }
    });
    return d.promise;
  };

  //get full info for video
  self.getVideo = function(subject, video){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    console.log(subject);
    console.log(video);
    var d = $q.defer();
    self.video = [];
    var query = "SELECT chapter, topic, source, intranetLink, internetLink, title, description, onDevice, supportMaterial, id, deviceLink FROM '" + dbObj[subject] + "' WHERE title = ?";
    $cordovaSQLite.execute(db, query, [video]).then(function(result){
      d.resolve();
      if(result.rows.length > 0){
        console.log(result.rows);  //result.rows.item[0].question
        self.videosList = result.rows;
      }
      else{
        self.videosList = false;
        console.log("no videos");
      }
    });
    return d.promise;
  };

  //Set local storage address for videos
  self.updateDeviceLink = function(subject, address, id){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = $q.defer();
    var rawDate = new Date();
    var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    var query = "UPDATE " + dbObj[subject] + " SET deviceLink = ?, downloadDate = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [address, dateToday, id]).then(function(result){
      console.log("updated deviceLink to address = " + address);
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.removeVideo = function(id, subject){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var query = "UPDATE " + dbObj[subject] + " SET deviceLink = NULL, downloadDate = NULL WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id]).then(function(result){
      console.log("deleted video from db");
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
  };
  return self;
});

app.factory('PointsEditor', function($q, $cordovaSQLite, $cordovaDevice){
  var self;
  self.appendPointsForGame = function(points, subject, topic, correct, wrong){
    var uuid = $cordovaDevice.getUUID();
    var d = $q.defer();
    var query = "UPDATE user SET pointsTotal = pointsTotal + ?, pointsCurrent = pointsCurrent + ? WHERE deviceId = ?";
    $cordovaSQLite.execute(db, query, [points, points, uuid]).then(function(res){
      console.log("added points to table =  user");
    }, function(err){
      console.log(err.message);
    });
    query = "UPDATE qaSubjectStats SET points = points + ?, totalCorrect = totalCorrect + ?, totalWrong = totalWrong + ? WHERE subject = ?";
    $cordovaSQLite.execute(db, query, [points, correct, wrong, subject]).then(function(res){
      console.log("added points to table =  qaSubjectStats");
    }, function(err){
      console.log(err.message);
    });
    query = "UPDATE qaTopicStats SET points = points + ?, totalCorrect = totalCorrect + ?, totalWrong = totalWrong + ? WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [points, correct, wrong, topic]).then(function(res){
      console.log("added points to table =  qaTopicStats");
    }, function(err){
      console.log(err.message);
    });
    var rawDate = new Date();
    var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    query = "UPDATE timeWiseStats SET score = score + ? WHERE date = ?";
    $cordovaSQLite.execute(db, query, [points, dateToday]).then(function(res){
      console.log(res.insertId);
      console.log("updated timeWiseStats " + dateToday);
      d.resolve();
    }, function(err){
      console.log(err.messsge);
      query = "INSERT INTO timeWiseStats (score, date) VALUES (?, ?)";
      $cordovaSQLite.execute(db, query, [points, dateToday]).then(function(res){
        console.log(res.insertId);
        console.log("inserted into timeWiseStats " + dateToday);
        d.resolve();
      }, function(err){
        console.log(err.message);
      });
    });
    return d.promise;
  };
  return self;
});

app.factory('DbLeaderboard', function($q, $cordovaSQLite){
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  var self = {
    today: 0,
    week: 0,
    month: 0
  };
  var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self.getScoreData = function(){
    var d = $q.defer();
    var query = "SELECT * FROM timeWiseStats";
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log(res.insertId);
      var rawDate = new Date();
      var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
      for(var x = 0; x < res.rows.length; x++){
        var someDay = new Date(String(res.row.item(x).date));
        var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(diffDays < 1){
          self.today += res.row.item(x).score;
          self.week += res.row.item(x).score;
          self.month += res.row.item(x).score;
        }
        else if(diffDays < 7){
          self.week += res.row.item(x).score;
          self.month += res.row.item(x).score;
        }
        else if(diffDays < 30){
          self.month += res.row.item(x).score;
        }
      }
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});

app.factory('DbTest', function($q, $cordovaSQLite){
  var self = {};
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self.getPreviousTests = function(){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE taken = 1";
    $cordovaSQLite.execute(db, query).then(function(res){
      d.resolve(res.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.checkCode = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(res.rows.length > 0){
        d.resolve(res.rows.item(0));
      }
      else{
        d.resolve(false);
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.getTest = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM " + code;
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log("length of data" + res.rows.length);
      d.resolve(res.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.getTestInfo = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(res.rows.length > 0){
        d.resolve(res.rows.item(0));
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.editStats = function(code, score){
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(!res.rows.item(0).taken){
        query = "UPDATE testsInfo SET taken = 1, score = ? WHERE password = '" + code + "'";
        $cordovaSQLite.execute(db, query, [score]).then(function(res){
          console.log("db: test is taken & scored");
        }, function(err){
          console.log(err.message);
        });
      }
      else{
        console.log("test is already taken");
      }
    }, function(err){
      console.log(err.message);
    });
  };
  self.storeTimeElapsed = function(code, time){
    query = "UPDATE testsInfo SET elapsedTime = ? WHERE password = '" + code + "'";
    $cordovaSQLite.execute(db, query, [time]).then(function(res){
      console.log("db: updated elapsedTime " + time);
    }, function(err){
      console.log(err.message);
    });
  };
  return self;
});

app.factory('DbDpp', function($q, $cordovaSQLite){
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self = {};
  self.getDppList = function(subject, topic){
    var d = $q.defer();
    var query = "SELECT * FROM " + subject + "Material WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(res){
      if(res.rows.length > 0){
        console.log("db: getting dpp " + topic);
        d.resolve(res.rows);
      }
      else{
        console.log("dpp empty");
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});
