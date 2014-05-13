angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller("StatusCtrl", function($scope, $ionicPopup, $location, StatusIO) {

	$scope.statusRefresh =function() {
		StatusIO.getHistory({}).then(function(data) {

			if (data.status == 200) {
				var jsonData = StatusIO.xmlTransform(data.data);
				
				// massage it
				realData = [];

				angular.forEach(jsonData,function(value, key){

					var title = "";
					var link = "";
					var date = "";
					var status = "";
					var isAlert = false;

					angular.forEach(value, function(filterObj , filterKey) {
					
						if (filterKey == "title") {
							title = filterObj;
						}
						else if (filterKey == "content") {
							if (filterObj.__text.indexOf("Resolved") >= 0) {
								status = "Resolved";
							}
							else {
								status = "Investigating";
								isAlert = true;
							}
						}
						else if (filterKey == "published") {
							date = filterObj;
						}
						else if (filterKey == "link") {
							link = filterObj._href;
						}	
					});

					var newObj ={
						title: title,
						link: link,
						date: date,
						status: status,
						isAlert: isAlert
					};

					realData.push(newObj);
				});

				$scope.entries = realData;
				$scope.$broadcast('scroll.refreshComplete');
			}
			else {
				$scope.$broadcast('scroll.refreshComplete');
			}
		});
	}

	StatusIO.getHistory({}).then(function(data) {

		if (data.status == 200) {
			var jsonData = StatusIO.xmlTransform(data.data);
			
			// massage it

			realData = [];

			angular.forEach(jsonData,function(value, key){

				var title = "";
				var link = "";
				var date = "";
				var status = "";
				var isAlert = false;

				angular.forEach(value, function(filterObj , filterKey) {
				
					if (filterKey == "title") {
						title = filterObj;
					}
					else if (filterKey == "content") {
						if (filterObj.__text.indexOf("Resolved") >= 0) {
							status = "Resolved";
						}
						else {
							status = "Investigating";
							isAlert = true;
						}
					}
					else if (filterKey == "published") {
						date = filterObj;
					}
					else if (filterKey == "link") {
						link = filterObj._href;
					}	
				});

				var newObj ={
					title: title,
					link: link,
					date: date,
					status: status,
					isAlert: isAlert
				};

				realData.push(newObj);
			});

			$scope.entries = realData;
			$scope.$emit('elementsChanged', $scope.entries);
		}
	});

})

.controller('AboutCtrl', function($scope, $ionicPopup, $location) {
	$scope.logOut = function() {

		$ionicPopup.confirm({
			title: 'Log Out',
				content: 'Are you want to log out?'
			}).then(function(res) {
			if(res) {
				localStorage.clear();
				$location.path("/app/login");
			} else {

			}
		});
	}
})

.controller('LoginCtrl', function($scope, IronIO, $location, $ionicViewService, $timeout, $ionicPopup) {

	if (IronIO.checkAuth()) {
		$location.path("/app/activity");
	}
	else {
		var item = IronIO.getCurrentItem();

		console.log(item);

		if (item) {

			$ionicPopup.alert({
	          title: 'Info',
	          content: item.message
	        }).then(function(res) {

	        });

	        IronIO.setCurrentItem(false);
		}

		$timeout(function() {
			$ionicViewService.clearHistory();
		}, 100);

		$scope.loginIron = function(settings) {
		 	$scope.settings = settings;

		 	console.log($scope.settings);

			IronIO.setConfig({
				"host" : $scope.settings.selected_host,
				"project_id": $scope.settings.project_id,
				"access_token": $scope.settings.access_token,
			});

			IronIO.validateToken({}).then(function callback(data) {
				console.log("VALIDATE THE TOKEN");
				console.log(data);
				if (data.status == 200) {
					localStorage.setItem("host", $scope.settings.selected_host);
					localStorage.setItem("project_id", $scope.settings.project_id);
					localStorage.setItem("access_token", $scope.settings.access_token);
					$location.path("/app/activity");
				} else {
					$ionicPopup.alert({
			          title: 'Error',
			          content: "Oh no! It doesn't seem that those credntials are correct. Please double check your information and try again. Error => " +data.status
			        }).then(function(res) {

			        });
				}
			});
		 }
	}

	
})

.controller('SettingsCtrl', function($scope, IronIO, $ionicPopup, $location, $ionicViewService, $timeout) {
	
	$scope.settings = {};

	if (localStorage.getItem("host")) {

		var options = {
			host: localStorage.getItem("host"),
			project_id: localStorage.getItem("project_id"),
			access_token: localStorage.getItem("access_token")
		}

		angular.forEach(options, function(value, key){
			$scope.settings[key] = value;

			if (key == "host") {
				$scope.settings.selected_host = value;
			}

		});

		$scope.firstLogin = false;
	}

	 $scope.saveSettings = function(settings) {
	 	$scope.settings = settings;

		IronIO.setConfig({
			"host" : $scope.settings.selected_host,
			"project_id": $scope.settings.project_id,
			"access_token": $scope.settings.access_token,
		});

		IronIO.validateToken({}).then(function callback(data) {
			if (data.status == 200) {
				localStorage.setItem("host", $scope.settings.selected_host);
				localStorage.setItem("project_id", $scope.settings.project_id);
				localStorage.setItem("access_token", $scope.settings.access_token);
				$location.path("/app/activity");
			} else {
				$ionicPopup.alert({
		          title: 'Error',
		          content: "Oh no! It doesn't seem that those credntials are correct. Please double check your information and try again. Error => " +data.status
		        }).then(function(res) {

		        });
			}
		});
	 }
})


.controller('ActivitesCtrl', function($scope, $location, IronIO, $ionicLoading, $ionicModal, $ionicPopup, $ionicScrollDelegate, $timeout, $ionicViewService) {

	if (IronIO.checkAuth()) {
		
		$timeout(function() {
			$ionicViewService.clearHistory();
		}, 100);

		IronIO.setConfig({
			host: localStorage.getItem("host"),
			project_id: localStorage.getItem("project_id"),
			access_token: localStorage.getItem("access_token")
		});

		$scope.formData = {};

		$scope.jsonString = function(obj) {
			return JSON.stringify(obj);
		}

		$scope.openModal = function() {

			$ionicModal.fromTemplateUrl('templates/modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();

				$timeout(function() {
					$ionicScrollDelegate.$getByHandle('small').scrollTop();
				}, 20);
			});		
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove();
		};

		$scope.createJob = function(event) {

			$scope.message = "";

			//var els = document.querySelectorAll(".modal .item input[type='radio']");

			var el = document.querySelector("#add-job-form");

			var args = serialize(el);

			if (args != "") {
				var codeName = args.replace("group=", "");

				$ionicLoading.show({
			      template: 'Creating Jobs...'
			    });

				IronIO.iwCodeCreateJob({"code_name":codeName}).then(function callback(data) {
					if (data.status == 200) {
						$scope.closeModal();
						$ionicLoading.hide();
						$ionicPopup.alert({
			              title: 'Success',
			              content: codeName + " was successfully created.",
			            }).then(function(res) {

			            });
					}
					else {
						ionicLoading.hide();
						console.log("==ERROR==");
						console.log(data);
					}
				});
			}
			else {
				$ionicPopup.alert({
		          title: 'Error',
		          content: "You didn't select a Task to run."
		        }).then(function(res) {

		        });
			}
		}

		$scope.handleColorBadge = function(size) {
			var sizeInt = parseInt(size);

			if (sizeInt >= 250) {
				return "assertive";
			}
			else if (sizeInt >= 100) {
				return "energized"
			}
			else {
				return "balanced"
			}
	 	}

	 	$scope.handleBadgeCounts = function(data) {
	 		angular.forEach(data.data, function(value, key){
				IronIO.mqQueueInfo({queue_name: value.name}).then(function success(data) {

					if (data.status == 200) {
						var sizeColor = $scope.handleColorBadge(data.data.size)
						angular.element(document.querySelector("#badgeid_"+data.data.id)).html(data.data.size);
						angular.element(document.querySelector("#badgeid_"+data.data.id)).attr('class', 'badge badge-'+sizeColor);
					}
					else {
						console.log("ERROR");
						console.log(data);
					}
				});
			});
	 	}	


		IronIO.mqQueues({}).then(function success(data) {
			if (data.status == 200) {
				$scope.queues = data.data;
				$scope.date = new Date();

				$scope.handleBadgeCounts(data);
			}
			else {
				console.log("===ERROR===");
				console.log(data);
			}
		});

		IronIO.iwCodes().then(function success(data) {
			if (data.status == 200) {
				$scope.codes = data.data.codes;
				
				var stats = {
					"run": 0,
					"queue": 0,
					"complete": 0
				};
			}
			else {
				console.log("===ERROR===");
				console.log(data);
			}
		});

		$scope.doRefresh = function() {

			$timeout(function() {
				IronIO.flushmqQueues();

		        IronIO.mqQueues({}).then(function success(data) {
					if (data.status == 200) {
						$scope.date = new Date();
						
						console.log("=== REFERSH ====");
						$scope.queues = data.data;

						$scope.handleBadgeCounts(data);

						$scope.$broadcast('scroll.refreshComplete');
					}
					else {
						console.log("===ERROR===");
						console.log(data);
						$scope.$broadcast('scroll.refreshComplete');
					}
				});
			}, 500);       
	    };
	}

	else {

		var obj = {
			message: "You need to setup your API credentials and select your projects before you can continue."
		}

		IronIO.setCurrentItem(obj);
		$location.path("/app/login#login");
	}
  

})

.controller('ActivityCtrl', function($scope, IronIO, $stateParams) {

	IronIO.setConfig({
		host: localStorage.getItem("host"),
		project_id: localStorage.getItem("project_id"),
		access_token: localStorage.getItem("access_token")
	});

	IronIO.mqQueueInfo({queue_name: $stateParams.queueName}).then(function success(data) {
		if (data.status == 200) {
			console.log(data);
			$scope.queue = data.data;
		}
		else {
			console.log("===ERROR===");
			console.log(data);
		}
	})
})

.controller('CodeCtrl', function($scope, IronIO, $stateParams, $ionicLoading) {

	IronIO.setConfig({
		host: localStorage.getItem("host"),
		project_id: localStorage.getItem("project_id"),
		access_token: localStorage.getItem("access_token")
	});

	$scope.tasks = false;

	$scope.codeName = $stateParams.codeName;

	var string = document.querySelector("#codes_"+$stateParams.codeName);

	if (string) {
		jsonString = JSON.parse(string.innerHTML);

		angular.forEach(jsonString,function(value, key){
			$scope["code_"+key] = value;
		});
	}
	else {
		IronIO.iwCodesInfo({id: $stateParams.codeId}).then(function success(data) {
			if (data.status == 200) {
				angular.forEach(data.data,function(value, key){
					$scope["code_"+key] = value;
				})
			}
			else {
				console.log("===ERROR===");
				console.log(data);
			}
		})
	}

	IronIO.iwCodesTasks({code_name: $stateParams.codeName}).then(function success(data) {
		if (data.status == 200) {
			$scope.tasks = data.data.tasks;
		}
		else {
			console.log("===ERROR===");
			console.log(data);
		}
	})
})
