( function(){
	"user strict";
	var app = angular.module("DemoApp", ['ngRoute']);

	app.config(function($routeProvider, $locationProvider) {
	  $routeProvider
	   .when('/upload', {
	    templateUrl: '/javascripts/angular/views/upload.html',
	    controller: "UploadCtrl"
	  })
	   .when('/about', {
	    templateUrl: '/javascripts/angular/views/about.html',
	    controller:'AboutCtrl'
	  })
	  .when('/base64', {
	    templateUrl: '/javascripts/angular/views/base64.html'
	  })	   
	  .otherwise({
                    redirectTo: '/',
                    templateUrl: "/javascripts/angular/views/hello.html"
                });

	  //  $locationProvider.html5Mode(true);
	});

	app.service("fileService", function(){
		this.enodedFiles = [];

	});

    app.controller('AboutCtrl',function($scope,$location){
    	$scope.isActive = function(route) {
    		console.log(route, $location.path);
       	 return route === $location.path();
    	}	
    });
	app.controller('UploadCtrl', function($scope) {
        $scope.image = null;
        $scope.imageFileName = '';
        $scope.files = [];
    });

    app.directive('fileDropzone', function() {
	  return {
	    restrict: 'A',
	    scope: {
	      files: "=",
	      file: '=',
	      fileName: '=',
	      dropzoneHoverClass: '@'
	    },
	    link: function(scope, element, attrs) {
	      var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, validMimeTypes;
	      getDataTransfer = function(event) {
	        var dataTransfer;
	        return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
	      };
	      processDragOverOrEnter = function(event) {
		        if (event) {
		          element.addClass(scope.dropzoneHoverClass);
		          if (event.preventDefault) {
		            event.preventDefault();
		          }
		          if (event.stopPropagation) {
		            return false;
		          }
	        }
	        getDataTransfer(event).effectAllowed = 'copy';
	        return false;
	      };
	      validMimeTypes = attrs.fileDropzone;
	      checkSize = function(size) {
		        var _ref;
		        if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
		          return true;
		        } else {
		          alert("File must be smaller than " + attrs.maxFileSize + " MB");
		          return false;
		        }
	      };
	      isTypeValid = function(type) {
	      	return true;
	        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
	          return true;
	        } else {
	          alert("Invalid file type.  File must be one of following types " + validMimeTypes);
	          return false;
	        }
	      };
	      element.bind('dragover', processDragOverOrEnter);
	      element.bind('dragenter', processDragOverOrEnter);
	      element.bind('dragleave', function() {
	        return element.removeClass(scope.dropzoneHoverClass);
	      });
	      return element.bind('drop', function(event) {
	        var file, name, reader, size, type;
	        var chunkSize=4096, offset = 0, chunk = null;
	        if (event != null) {
	          event.preventDefault();
	        }
	        element.removeClass(scope.dropzoneHoverClass);


	        var readInChunks = (function(){
        		var chunkSize = 4096;
        		var fiieArray = [];
			
        		return function( file, cb){
        			var size = file.size;
        			var type = file.type;
        			var name = file.name;
					var reader = new FileReader();
	 				reader.readAsBinaryString(file);
	 				var iFile = {};


			        reader.onload = function(evt) {
			          if (checkSize(size) && isTypeValid(type)) {
			            scope.$apply(function() {
			              iFile["image"] =  "data:" + file.type + ";base64," + btoa(evt.target.result) ;
			              iFile["base64"] = btoa(evt.target.result);			              
			              scope.file = "data:" + file.type + ";base64," + btoa(evt.target.result);
			              if (angular.isString(scope.fileName)) {
			              	iFile["name"] =  name;
			                return scope.fileName = name;
			              }
			            });
			            
			          }// end 'if'

			        } // end 'onload'
			       
			       reader.onloadend = function(evt){
			       	cb( iFile );
			       }

			        reader.onprogress = function(data) {
		            	if (data.lengthComputable) {                                            
		                	var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
		                	scope.files[name]["progress"] = progress;
		                	console.log(progress);
		            	}
		       		}
        		}

	        })();	



	        function convertFile( file){
		        if( file ){
			        name = file.name;
			        type = file.type;
			        size = file.size;
			        scope.files[name] = {
			        	"name" : name,
			        	"type" : type,
			        	"size" : size
			        }
			        readInChunks( file, function(data){
			        	scope.files[name]["image"] = data.image;
			        	scope.files[name]["base64"] = data["base64"];
			        });

			    }else{
			    	console.log("Not a file");
			    }
	        }

	        for( var i = 0; i < getDataTransfer(event).files.length; i++ ){
	        	convertFile( getDataTransfer(event).files[i] );
	        }

	        return false;

	      });// end 'drop'

	    }
	  };
	});

	

})();

	