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
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = (?)";
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log(result);
      if(result.rows.length > 0){
          var res =  [result.rows.item[0].firstname, result.rows.item[0].lastname, result.rows.item[0].admnNo, result.rows.item[0].accessMethod];
          console.log(result.rows);
          d.resolve(res);
      }
      else{
        d.reject();
      }
      return d.promise;
    });
  };

  return self;
});
app.factory('DbItemAdd', function($q, $cordovaSQLite){
  var self = {};
  self.addQuestion = function(question){
    console.log("adding question");
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: 'physicsQuestions',
      chemistry: 'chemistryQuestions',
      maths: 'mathsQuestions'
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[question.subject] + " (chapter, topic, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [question.chapter, question.topic, question.question, question.questionImage,
                                       question.a, question.aImg, question.b, question.bImg, question.c, question.cImg,
                                       question.d, question.dImg, question.answer, question.level, 0, question.id])
                                       .then(function(result){
                                          d.resolve();
                                          console.log("insert id = " + result.insertId);
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
    var query = "INSERT INTO " + dbObj[video.subject] + " (chapter, topic, source, intranetLink, internetLink, title, description, onDevice, supportMaterial, id, deviceLink) VALUES (?, ?, ?, ?, ?, ?, ?,? ,? ,? ,?)";
    $cordovaSQLite.execute(db, query, [video.chapter, video.topic, video.source, video.intranetLink, video.internetLink, video.title, video.description, 0, null, video.id, null])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            });
    return d.promise;
  };
  self.addStudyMaterial = function(file){
    console.log("adding studyMaterial");
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsMaterial",
      chemistry: "chemistryMaterial",
      maths: "mathsMaterial"
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[file.subject] + " (chapter, topic, intranetLink, internetLink, title, description, onDevice, id, deviceLink, fileType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
    $cordovaSQLite.execute(db, query, [file.chapter, file.topic, file.intranetLink, file.internetLink, file.title, file.description, 0, file.id, null, file.fileType])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            });
    return d.promise;
  };
  return self;
});

app.factory('DbQuestions', function($q, $cordovaSQLite){
  var self = {};
  self.getQuestions = function(subject, topic){
    var d = $q.defer();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, wrong, id FROM '" + subject + "' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
      d.resolve();
      if(result.rows.length > 0){
        console.log(result.rows);  //result.rows.item[0].question
        self.questions = result.rows;
      }
      else{
        self.questions = false;
        console.log("no questions");
      }
    });
    return d.promise;
  };
  self.addWrong = function(idArr, wrongNumber, subject){
    var d = $q.defer();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    for(x = 0; x < idArr.length; x++){
      var query = "UPDATE " + subject + " SET wrong = " + wrongNumber[x] + " WHERE id = ?";
      $cordovaSQLite.execute(db, query, [idArr[x]]);
    }
    d.resolve();
    console.log("wronged all");
    return d.promise;
  };
  self.editStats = function(){
    var d = $q.defer();

    return d.promise;
  };
  return self;
});

app.factory('DbVideos', function($q, $cordovaSQLite){
  var self = {};
  self.getVideosList = function(subject, topic){
    var d = q.defer();
    self.videosList = [];
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT chapter, topic, source, intranetLink, internetLink, title, description, onDevice, supportMaterial, id, deviceLink FROM '" + subject + "' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
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
  self.getVideo = function(subject, video){
    var d = q.defer();
    self.video = [];
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT chapter, topic, source, intranetLink, internetLink, title, description, onDevice, supportMaterial, id, deviceLink FROM '" + subject + "' WHERE title = ?";
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
  self.updateDeviceLink = function(video, subject, address){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = q.defer();
    var query = "UPDATE " + dbObj[subject] + " SET deviceLink = " + address + " WHERE id = ?";
    $cordovaSQLite.execute(db, query, [idArr[x]]).then(function(result){
      console.log("updated deviceLink to address");
      d.resolve();
    });
    return d.promise;
  };
  return self;
});
