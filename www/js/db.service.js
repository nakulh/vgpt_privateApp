var db = null;
var app = angular.module('db.service', []);

app.factory('DbServiceSettings', function($q, $cordovaSQLite, $cordovaDevice){
  var uuid = $cordovaDevice.getUUID();
  var self = {};
  self.changeAccess = function(accessMethod){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var d = $q.defer();
    var query  = "UPDATE user SET accessMethod='" + accessMethod + "', WHERE uuid='" + uuid + "'";
    $cordovaSQLite.execute(db, query, [accessMethod]).then(function(result){
      d.resolve();
      console.log("insert id = " + result.insertId);
    }, function(err){
      d.reject();
      console.log(err);
    });
    return d.promise;
  };
  self.getUserInfo = function(){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var d  = $q.defer();
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE uuid = ?";
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log(result);
      if(result.rows.length > 0){
          var res =  [result.rows.item[0].firstname, result.rows.item[0].lastname, result.rows.item[0].admnNo, result.rows.item[0].accessMethod];
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
