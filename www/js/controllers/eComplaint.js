angular
    .module('livein')
    .controller('eComplaint', eComplaint)
    .controller('eComplaintList', eComplaintList);

    function eComplaint($ionicPlatform, $window, $ionicSlideBoxDelegate, $localStorage, $scope, $state, eComplaintService, $ionicLoading, $ionicPopup, $timeout, $location, $cordovaFile, $cordovaFileTransfer,$cordovaFileOpener2, $filter) {
        ionic.Platform.ready(function () {
            $scope.at = localStorage.getItem('at');
            //if (localStorage.getItem('at') === null && localStorage.getItem('tt') === null ) {
                eComplaintService.getToken(function(response) {
                    if (response != false) {
                        var at = response.access_token;
                        var tt = response.token_type;
                        
                        localStorage.setItem('at', at);
                        localStorage.setItem('tt', tt);
                    } else {
                        eComplaintService.getToken(function(response) {
                            var at = response.access_token;
                            var tt = response.token_type;
                            localStorage.setItem('at', at);
                            localStorage.setItem('tt', tt);
                        })
                    }
                });
            /*} else {
                eComplaintService.getToken(function(response) {
                    if (response != false) {
                        var at = response.access_token;
                        var tt = response.token_type;
                        localStorage.setItem('at', at);
                        localStorage.setItem('tt', tt);
                    } else {
                        console.log('gaisa njumuk 2');
                    }
                });
            }*/
            console.log($scope.at);
        });
    };

    function eComplaintList($ionicSlideBoxDelegate, $localStorage, $scope, $state, eComplaintService, $ionicLoading, $ionicPlatform, $ionicPopup, $timeout, $location, $cordovaFileOpener2, $filter, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet,$window, $cordovaImagePicker){
        
        $scope.images = [];
        $scope.data = {};
        $scope.checking = false;
        //$scope.newCase = newCase;
        //Tambahkan
        var at = localStorage.getItem('at');

        eComplaintService.getUnit(at, function(response) {
            if (response != false) {
                $scope.pps = response.PsCode;
                var pp = $scope.pps;
                
                if(localStorage.getItem('pp') != null){
                    var pp = localStorage.getItem('pp');
                    console.log('get item : ' ,pp);
                } else {
                    localStorage.setItem('pp', pp);
                    console.log('set item : ' ,pp);
                }
                
                $scope.dataUnit = response;
                $scope.unit = response.ListUnit;
                
            } else {
                console.log('haha kasian ');
            }
        });
        
        //insert
        $scope.newCase = function(data,at){
            var at = localStorage.getItem('at');
            console.log('data newCase : ', JSON.stringify(data));
            console.log('isole : ',$localStorage.pp);
            var pp = localStorage.getItem('pp');
            var email = $localStorage.currentUser.data[0].email;
            var fullname = $localStorage.currentUser.data[0].fullname;
            var phone = $localStorage.currentUser.data[0].phone;
            var unit = $scope.unit[0].IdDropDown;
            var concern = $scope.data.concern;
            //var pps = $scope.pps;
            var linkImg = $scope.images;

                eComplaintService.insertCase(
                    at,
                    pp,
                    email,
                    fullname,
                    phone,
                    unit,
                    concern,
                    data.description,
                    linkImg, 
                function(response){
                    if (response != false) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'eComplaint',
                            template: $filter('translate')('e_success'),
                            okType: "button-stable",
                            cssClass: "alertPopup"
                        });
                        //getlistcase
                        eComplaintService.getListCase(at, function(response) {
                            if (response != false) {
                                $scope.list = response;
                                $scope.dataList = response.ListCase;
                                console.log('sudah diupdate : ' , JSON.stringify($scope.dataList));
                            } else {
                                console.log('huft kasian ' , response);
                            }
                        });
                        console.log('Umak Spesial : ',JSON.stringify(response));
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'eComplaint',
                            template: $filter('translate')('e_failed'),
                            okType: "button-stable",
                            cssClass: "alertPopup"
                        });
                        console.log('Umak ndak Spesial ');
                    }

                });
        }

        
        $scope.changedUnit = function() {
            var id = $scope.data.index;
            //$scope.data.concern = 0;
            if(id != null){
                var at = localStorage.getItem('at', JSON.stringify(at));
                eComplaintService.getHelpname(at, id, function(response) {
                    if (response != false) {
                        $scope.nameDropDown = response.ListHelpName;
                    } else {
                        console.log('huft');
                    }
                });
            }
        }
        
        //getlistcase
        eComplaintService.getListCase(at, function(response) {
            if (response != false) {
                $scope.list = response;
                $scope.dataList = response.ListCase;
                console.log('response : ' , JSON.stringify($scope.dataList));
            } else {
                console.log('huft kasian ' , response);
            }
        });

        //Image
        $scope.tackPicture = function() {
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 3, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 100, // Higher is better
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };

            $cordovaImagePicker.getPictures(options).then(function(results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    
                    $scope.images.push({
                        filename: "eComplaint-" + [i] + ".jpg",
                        Base64String: "data:image/jpeg;base64," + results[i]
                    });
                }
                $scope.checking = true;
                $scope.progressUpload = true;

                $timeout(function() {
                    $scope.progressUpload = false;
                }, 6000);
            
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error)); // In case of error
            })
        }

        $scope.pathForImage = function(images) {
            if (images === null) {
                return ''
            } else {
                return cordova.file.dataDirectory + images
            }
        }
        $scope.clearImages = function() {
            $scope.images = [];
            $scope.checking = false;
        }
        //end of image
        
        $scope.generals = 'active';

        // general tab & property tab
        var genTab = angular.element(document.querySelector('#generaltab'));
        var proTab = angular.element(document.querySelector('#propertytab'));
        genTab.addClass("active");

        $scope.general = function() {
            $ionicSlideBoxDelegate.previous();
            $scope.generals = 'active';
            $scope.propertys = '';
        };
        $scope.property = function() {
            $ionicSlideBoxDelegate.next();
            $scope.propertys = 'active';
            $scope.generals = '';
        };
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
            if ($scope.slideIndex == 1) {
                $scope.generals = '';
                $scope.propertys = 'active';
            } else {
                $scope.propertys = '';
                $scope.generals = 'active';
            }
        };

    };