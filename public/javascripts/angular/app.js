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
	  .when('/about', {
	    templateUrl: '/javascripts/angular/views/base64.html'
	  })	   
	  .otherwise({
                    redirectTo: '/',
                    templateUrl: "/javascripts/angular/views/hello.html"
                });

	  //  $locationProvider.html5Mode(true);
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
    });

    app.directive('fileDropzone', function() {
	    return {
	      restrict: 'A',
	      scope: {
	        file: '=',
	        fileName: '='
	      },
	      link: function(scope, element, attrs) {
	        var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
	        processDragOverOrEnter = function(event) {
	          if (event != null) {
	            event.preventDefault();
	          }
	          event.originalEvent.dataTransfer.effectAllowed = 'copy';
	          return false;
	        };
	        validMimeTypes = attrs.fileDropzone;
	        checkSize = function(size) {
	        	return true;
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
	        
	        element.bind('dragenter', function(ev){
	        	$(element).toggleClass("toggleEnter");
	        });
	        element.bind('dragleave', function(ev){
	        	$(element).toggleClass("toggleEnter");
	        });
	        element.bind('dragover', processDragOverOrEnter);
	        element.bind('dragenter', processDragOverOrEnter);

	        return element.bind('drop', function(event) {
	          var file, name, reader, size, type;
	          if (event != null) {
	            event.preventDefault();
	          }          

	          reader = new FileReader();
	          reader.onload = function(evt) {
	            if (checkSize(size) && isTypeValid(type)) {
	              return scope.$apply(function() {
	                scope.file = "data:" + file.type + ";base64," + btoa(evt.target.result);
	                if (angular.isString(scope.fileName)) {
	                  return scope.fileName = name;
	                }
	              });
	            }
	          }
	          reader.onloadend = function (readEvt) {
	          	console.log( btoa(readEvt.target.result) ); 
	          	$(element).removeClass("toggleDrop toggleEnter");
	          	$(element).find("span").text("Drop File Here");
			  }


	          file = event.originalEvent.dataTransfer.files[0];
	          if( file ){
      	          console.log(file);
      	          name = file.name;
      	          type = file.type;
      	          size = file.size;
      	          reader.readAsBinaryString(file);
   		          $(element).toggleClass("toggleDrop");
  		          $(element).find("span").text("Calculating...");
	          	}
			  //reader.readAsDataURL(file);
	          return false;
	        });
	      }
	    };
	  });

	

})();

	