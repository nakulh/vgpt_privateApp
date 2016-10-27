var app = angular.module('dpp.controller', ['db.service', 'dpp.service']);
app.controller('dppTopicCtrl', function($scope, $stateParams, DppService){
  if($stateParams.subject == "maths"){
    $scope.topics = ["quadratic eq", "integration", "differentiation"];
    $scope.dppLink = ["quadratic_eq", "integration", "differentiation"];
  }
  else if($stateParams.subject == "physics"){
    $scope.topics = ["modern physics", "electrostatics", "mechanics"];
    $scope.dppLink = ["modern_physics", "electrostatics", "mechanics"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topics = ["1", "2", "3"];
    $scope.dppLink = ["1", "2", "3"];
  }
  $scope.addDpp = function(){
    DppService.addDpp().then(function(res){
      console.log("added all dpp");
    });
  };
  $scope.subject = $stateParams.subject;
});
app.controller('dppListCtrl', function($scope, $stateParams, DbDpp, $cordovaFileOpener2){
  DbDpp.getDppList($stateParams.subject, $stateParams.topic).then(function(res){
    var Dpp = function(dpp){
      this.title = dpp.title;
      this.description = dpp.description;
      var  mime = "";
      if(dpp.fileType == "pdf"){
        mime = "application/pdf";
      }
      else{
        mime = "image/"+dpp.fileType;
      }
      this.open = function(){
        $cordovaFileOpener2.open(
          dpp.deviceLink,
          mime
        ).then(function() {
            console.log("file opened");
        }, function(err) {
            console.log(err);
            var strBuilder = [];
            for(var key in err){
                  if (err.hasOwnProperty(key)) {
                     strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                }
            }
            console.log(strBuilder.join(""));
        });
      };
    };
    $scope.dpps = [];
    if(res.length >= 0){
      for(var x = 0; x < res.length; x++){
        $scope.dpps.push(new Dpp(res.item(x)));
      }
    }
    else{
      $cordovaToast
        .show('No Dpps in this category yet', 'long', 'center');
    }
  });
});
