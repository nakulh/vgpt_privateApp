angular.module('starter.controllers', ['db.service'])

.controller('AppCtrl', function($scope, $ionicModal, DbServiceSettings, $cordovaDevice) {
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
      }, function(err){
        console.log(err);
      });
    }
    else{
      DbServiceSettings.changeAccess("internet").then(function(data){
        console.log("internet");
      }, function(err){
        console.log(err);
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
  $scope.save = function(firstname, lastname, admnNo){
    var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var uuid = $cordovaDevice.getUUID();
    var query = "INSERT INTO user (firstname, lastname, admnNo, deviceId, accessMethod) VALUES (?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname, admnNo, uuid, "intranet"]).then(function(result){
      console.log("insert id = " + result.insertId);
    });
    console.log("uuid = " + uuid);
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
