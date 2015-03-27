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
	    templateUrl: '/javascripts/angular/views/base64.html',
	    controller:'Base64Ctrl'
	  })	   
	  .otherwise({
                    redirectTo: '/',
                    templateUrl: "/javascripts/angular/views/hello.html"
                });

	  //  $locationProvider.html5Mode(true);
	});

	app.service("FileService", function(){
		this.encodedFiles = [];

	});
	app.controller('Base64Ctrl', ['$scope', 'FileService',
	 function($scope, fileService) {
    	   $scope.storedFiles = fileService.encodedFiles;

    	   $scope.clearFiles  = function(){
    	   	console.log("clearing files");
    	   	$scope.storedFiles.splice(0, $scope.storedFiles.length)
    	   }

    }])
    app.controller('AboutCtrl',function($scope,$location){
    	$scope.isActive = function(route) {
    		console.log(route, $location.path);
       	 return route === $location.path();
    	}	
    });
	app.controller('UploadCtrl', ['$scope', 'FileService', function($scope, fileService) {
        $scope.storedFiles = fileService.encodedFiles;

    }]);

    app.directive('fileDropzone', ['FileService',  function(fileService) {
	  return {
	    restrict: 'A',
	    scope: {
	      uploadedFiles: "=",
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
	        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
	          return true;
	        } else {
	          console.log( "file type: ", type);
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
	        var totalFiles = getDataTransfer(event).files.length;

	        if (event != null) {
	          event.preventDefault();
	        }
	        element.removeClass(scope.dropzoneHoverClass);


	        var readInChunks =  function( file, cb){
        			var size = file.size;
        			var type = file.type;
        			var name = file.name;
					var reader = new FileReader();
	 				reader.readAsBinaryString(file);
	 				var iFile = {};
	 				var gotError = false;


			        reader.onload = function(evt) {
			          if (checkSize(size) && isTypeValid(type)) {
			          	iFile["type"] = file.type;
			          	if( file.type.indexOf("image") !== -1)
				       		iFile["image"] =  "data:" + file.type + ";base64," + btoa(evt.target.result) ;

			            iFile["base64"] = btoa(evt.target.result);	
		                if (angular.isString( name)) {
			              	iFile["name"] =  name;
			            }			            
			          }else{
			          	gotError = true;
			          	return;
			          }

			         // return iFile;
			        } // end 'onload'
			       
			       reader.onloadend = function(evt){
			       		if( !gotError )	
				       	 	cb(null, iFile );
				      	else
				      		cb("invalid file", null);

			       	 return ;
			       }

			        reader.onprogress = function(data) {
		            	if (data.lengthComputable) {                                            
		                	var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
		                	iFile["progress"] = progress;
		                	console.log(progress);
		            	}
		       		}
	        }

	        var convertFile = function( file, cb){

		        if( !file ){
		        	console.log("not a file", file);
		        	//alert("Only files please");
		        	cb("Not a file", null);
		        	return;
		        }
		        readInChunks( file, function(err, readFileObj){
		        	cb(err, readFileObj);
		        });
	        } // end 'convertFile'

			function asyncLoop(iterations, func, callback) {
			    var index = 0;
			    var done = false;
			    var loop = {
			        next: function() {
			            if (done) {
			                return;
			            }

			            if (index < iterations) {
			                index++;
			                func(loop);

			            } else {
			                done = true;
			                callback();
			            }
			        },

			        iteration: function() {
			            return index - 1;
			        },

			        break: function() {
			            done = true;
			            callback();
			        }
			    };
			    loop.next();
			    return loop;
			}

			(function(){
				var eEvent = getDataTransfer(event);
				var eFiles = eEvent.files;
				var totalFiles  = eFiles.length;

				asyncLoop(totalFiles, function(loop) {
				    convertFile( eFiles[loop.iteration()], function(err, data) {
				    	
				    	scope.$apply(function(){
				    		if( !err && typeof data === "object"){
					    		scope.uploadedFiles.push(data);
				    		}else{
				    			console.log("Error reading file: ", err);
				    		}
				    	});
				    	
				        console.log(loop.iteration());
				        loop.next();
				    })},
				    function(){
				    	console.log('cycle ended');
			    		console.log( scope.uploadedFiles);
					}
				);

			})();	

	        return false;

	      });// end 'drop'

	    }
	  };
	} ]);

	

})();

	