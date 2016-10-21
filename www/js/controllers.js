angular.module('starter.controllers', ['db.service'])

.controller('AppCtrl', function($scope, $ionicModal, DbServiceSettings, $cordovaDevice, $cordovaSQLite) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //switch between intranet and internet
  $scope.saveSettings = function(intranet){
    if(intranet){
      DbServiceSettings.changeAccess("intranet").then(function(data){
        console.log("intranet");
      }, function(error){
        for(var e in error)
          console.log(error[e]);
        console.log("error");
      });
    }
    else{
      DbServiceSettings.changeAccess("internet").then(function(data){
        console.log("internet");
      }, function(error){
        for(var e in error)
          console.log(error[e]);
        console.log("error");
      });
    }
  };

  //prepare the permanent settings view model
  $ionicModal.fromTemplateUrl('templates/permanentSettings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  //fx for closing model
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //check for correct password and display the permanent settings pane
  $scope.enterPermanentSettings = function(password){
    if(password == "nakul"){
      $scope.modal.show();
    }
  };
  $scope.save = function(firstname, lastname, admnNo, batch){
    var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var uuid = $cordovaDevice.getUUID();
    var query = "INSERT INTO user (firstname, lastname, admnNo, deviceId, batch, accessMethod) VALUES (?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname, admnNo, uuid, batch, "intranet"]).then(function(result){
      console.log("insert id = " + result.insertId);
    }, function(err){
      console.log(err.message);
    });
    console.log("uuid = " + uuid);

    //Code for sample data
    query = "INSERT INTO qaLevels (subject, chapter, topic, level) VALUES (?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, ["physics", "modern_physics", "modern_physics", 0]).then(function(result){
      console.log("inserted modern_physics lvl 0");
    }, function(err){
      var strBuilder = [];
      for(var key in err){
            if (err.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    });
    $cordovaSQLite.execute(db, query, ["physics", "mechanics", "mechanics", 0]).then(function(result){
      console.log("inserted mechanics lvl 0");
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
    //end code for sdample data
    $scope.closeModal();
  };
  $scope.reset = function(){
    console.log("reset");
  };

  //this is for dev only
  $scope.delDB = function(){
    $cordovaSQLite.deleteDB({name: 'my.db', location: 'default'});
  };
});
