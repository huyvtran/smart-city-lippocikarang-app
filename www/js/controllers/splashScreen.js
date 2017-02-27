angular
  .module('livein')
  .controller('splashScreen', splashScreen);

  function splashScreen($scope, $state, $filter, $localStorage, $location, ionicToast, $ionicPlatform, $ionicPopup, AdvertiseService) {

    // Called to navigate to the main app
    $ionicPlatform.ready(function () {
      $scope.buttonDisabled = false;

      //screen.lockOrientation('portrait');
      if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
          cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
          if(enabled == true){
            ionicToast.show( $filter('translate')('gps_on') , 'bottom', false, 5000);
            cordova.plugins.notification.local.schedule({
                id: 1,
                message: $filter('translate')('gps_set'),
                sound: playSound,
                autoCancel: true
            });
          }
          if (enabled == false) {
            var confirmPopup = $ionicPopup.confirm({
              title : $filter('translate')('dialog_title_gps'),
              template : $filter('translate')('dialog_content_gps')
            });
            confirmPopup.then(function (res) {
              if (res) {
                cordova.plugins.diagnostic.switchToLocationSettings();
              } else {
                console.log('You are not sure');
              }
            });

          }
        }, function (error) {
          alert("The following error occurred: " + error);
        });
      }
    });

    $ionicPlatform.ready(function (){
      navigator.geolocation.getCurrentPosition(function (pos) { });
      $scope.buttonDisabled = false;
    });

    $scope.startApp = function () {
      $scope.buttonDisabled = false;

      if (!$localStorage.currentUser) {

        $state.go('login');

      } else {

        $state.go('app.main');
        AdvertiseService.AdsOpen();   

      }
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };

  }
