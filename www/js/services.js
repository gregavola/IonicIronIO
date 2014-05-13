angular.module('starter.services', [])

.factory('StatusIO', ['$http', function($http) {

	var baseURL = "https://api.statuspage.io/v1/pages";

	var StatusIO = {

		setConfig: function(options) {
			access_token = options.access_token;
		},

		getHistory: function(options, callback, error) {

			var url = "http://status.iron.io/history.atom";

			var configObj = {
                method: "GET",
                url: url,
                data: "",
                headers: {} 
            }

            return StatusIO.call(configObj, callback);
		},

		xmlTransform: function(data) {
	        var x2js = new X2JS();
	        var json = x2js.xml_str2json( data );
	        return json.feed.entry;
	    },

		getIncidents: function(callback, error) {
			var getURL = baseURL + "/" + options.page_id + "/incidents.json";

        	

            var configObj = {
                method: "GET",
                url: getURL,
                data: "",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
            }

			return StatusIO.call(configObj, callback);
		},

        call: function(configObj, callback) {

			// Clearing Commons
			$http.defaults.headers.common = {};
			$http.defaults.headers.post = {};
			$http.defaults.headers.put = {};
			$http.defaults.headers.patch = {};

			return $http({
				method  : configObj.method,
				url     : configObj.url,
			    data    : configObj.data,  // pass in data as strings
			    headers : configObj.headers  // set the headers so angular passing info as form data (not request payload)
			}).then(function(data, status) {
				var newObj = {
					data: data.data,
					status: data.status
				};

				return newObj;
			});
		}

	};

	return StatusIO;
}])

.factory('IronIO', ['$http', function($http) {
	var awsWorkerEndpoint = "https://worker-aws-us-east-1.iron.io/2/projects/";

	var rsmqURL = "https:/mq-rackspace-ord.iron.io/1/projects/";
	var mqURL = {
		"aws_useast" : {
			"url": "https:/mq-aws-us-east-1.iron.io/1/projects/"
		},
		"aws_euwest" : {
			"url": "https://mq-aws-eu-west-1.iron.io/1/projects/"
		},
		"rs_ord" : {
			"url": "https://mq-rackspace-ord.iron.io/1/projects/"
		},
		"rs_lon" : {
			"url" : "https://mq-rackspace-lon.iron.io/1/projects/"
		}
	}

	var baseURL = "";
	var access_token = "";
	var projectId = "";

	var promise = "";
	var iwpromise = "";

	var currentViewItem = false;

	var IronIO = {

		checkAuth: function() {
			if (localStorage.getItem("host")) {
				return true;
			}
			else {
				return false;
			}
		},

		setCurrentItem: function(object) {
			currentViewItem = object
		},

		getCurrentItem: function() {
			return currentViewItem;
		},

		setConfig: function(options) {

			if (localStorage.getItem("host")) {

				options = {
					host: localStorage.getItem("host"),
					project_id: localStorage.getItem("project_id"),
					access_token: localStorage.getItem("access_token")
				}
			}

			if (options) {
				baseURL = mqURL[options.host].url;
				projectId = options.project_id;
				access_token = options.access_token;
			}
		},

		getHostURL: function() {
			return baseURL;
		},

		validateToken: function(callback, error) {
			var getURL = baseURL + projectId + "/queues";

        	

            var configObj = {
                method: "GET",
                url: getURL,
                data: "",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
            }

			return IronIO.call(configObj, callback);
		},

		iwCodes: function(callback, error) {
			if ( !iwpromise ) {
	        	var getURL = awsWorkerEndpoint + projectId + "/codes";

	        	

	            var configObj = {
	                method: "GET",
	                url: getURL,
	                data: "",
	                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
	            }

				iwpromise = IronIO.call(configObj, callback);
	           	
	        } else {
	        	console.log("cached");
	        }

	        return iwpromise;
		},

		iwCodeCreateJob: function(options, callback, error) {
			
			var getURL = awsWorkerEndpoint + projectId + "/tasks";

			

			var data = {
				"tasks": [{
					"code_name": options.code_name,
					"payload": "{}"
				}]
			}

            var configObj = {
                method: "POST",
                url: getURL,
                data: data,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
            }

			return IronIO.call(configObj, callback);
		},

		iwCodesTasks: function(options, callback, error) {

			var getURL = awsWorkerEndpoint + projectId + "/tasks?code_name"+options.code_name;

			

            var configObj = {
                method: "GET",
                url: getURL,
                data: "",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
            }

			return IronIO.call(configObj, callback);

		},

		iwCodesInfo: function(options, callback, error) {
			var getURL = awsWorkerEndpoint + projectId + "/codes/"+options.id;

        	console.log(access_token);

            var configObj = {
                method: "GET",
                url: getURL,
                data: "",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
            }

			return IronIO.call(configObj, callback);
		},

		mqQueueInfo: function(options, callback, error) {

        	var getURL = baseURL + projectId + "/queues/"+options.queue_name;

            var singleObj = {
                method: "GET",
                url: getURL,
                data: "",
                headers: { 'Content-Type': 'application/json', 'Authorization': ' OAuth ' + access_token } 
            }

            return IronIO.call(singleObj, callback, error);
        },

        mqQueues: function(options, callback) {
        	if ( !promise ) {
	        	var getURL = baseURL + projectId + "/queues";

	        	console.log(access_token);

	            var configObj = {
	                method: "GET",
	                url: getURL,
	                data: "",
	                headers: { 'Content-Type': 'application/json', 'Authorization': 'OAuth ' + access_token } 
	            }

				promise = IronIO.call(configObj, callback);
	           	
	        } else {
	        	console.log("cached");
	        }

	        return promise;
        },

        flushmqQueues: function() {
	    	promise = "";
	    },

        call: function(configObj, callback) {

			// Clearing Commons
			$http.defaults.headers.common = {};
			$http.defaults.headers.post = {};
			$http.defaults.headers.put = {};
			$http.defaults.headers.patch = {};

			return $http({
				method  : configObj.method,
				url     : configObj.url,
			    data    : configObj.data,  // pass in data as strings
			    headers : configObj.headers  // set the headers so angular passing info as form data (not request payload)
			}).then(function(data, status) {
				var newObj = {
					data: data.data,
					status: data.status
				};

				return newObj;
			});
		}

	};
	return IronIO;
}]);

