var app = angular.module('update.controller', ['update.service']);
app.controller('UpdateCtrl', function($scope, UpdateService, DbServiceSettings, DbItemAdd, $cordovaDevice, $cordovaSQLite, $http){
  $scope.checkUpdates = function(){
    var uuid = $cordovaDevice.getUUID();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = (?)";
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log("result");
      if(result.rows.length > 0){
        for(var x in result.rows.item[0]){
          console.log(x);
          console.log(result.rows.item[0][x]);
        }
          //var res =  [result.rows.item[0].firstname, result.rows.item[0].lastname, result.rows.item[0].admnNo, result.rows.item[0].accessMethod];
        console.log(result.rows);
      }
      /*var user = {
        firstname: userInfo[0],
        lastname: userInfo[1],
        admnNo: userInfo[2]
      };*/
      //console.log(user);
      var url = "";
      /*if(userInfo[3] == "intranet"){
        url = "someIp";
      }
      else{
        url = "someURL";
      }*/
      console.log("getting JSON");
      $http.get("./js/updateReply.json").success(function(reply){
        console.log(reply.length);
        angular.forEach(reply, function(item, index){
          console.log("item type --");
          console.log(item.type);
          if(item.type == "question"){
            console.log("question detected");
            DbItemAdd.addQuestion(item).then(function(success){
              console.log("question Added");
            });
          }
          else if(item.type == "video"){
            console.log("video detected");
            DbItemAdd.addVideo(item).then(function(success){
              console.log("video Added");
            });
          }
          else if(item.type == "studyMaterial"){
            console.log("studyMaterial detected");
            DbItemAdd.addStudyMaterial(item).then(function(success){
              console.log("studyMaterial Added");
            });
          }
        });
      });
    });
  };
});
