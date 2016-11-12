describe('Test site.js', function() {
	
   //
   // Example: A test case of getRandomIntInclusive
   //
   describe('getRandomIntInclusive Coverage Test', function() {

	  it('value within 1 to 3', function() {
	  	var value = getRandomIntInclusive(1, 3);
	  	expect( value>=1 && value <= 3 ).toEqual(true);
	  });
   });  
   /*
	describe('getURLParameter test', function() {
		//inject(function('$window')
		var url = "team.html?q=test";
		var location ="";
		inject(function(url){
			location = url;
			//spyOn($location,'decodeURIComponent');
		});
		
		it('return event name from url', function($window) {
			//spyOn(firebase,'decodeURIComponent');
			var eventName = getURLParameter("q");
			//$window.location.href= '/team.html?q=test';
			//console.log($window.location);
		expect(eventName).toEqual("test");
	  });
	});
	*/
	describe('init firebase test', function() {
		it('will initial firebase', function() {
			//var testApp = new initApp();
			spyOn(firebase,'initializeApp');
			initalizeFirebase();
			//initApp();
			expect(firebase.initalizeApp).tohaveBeenCalled;
		});
	});
	
});

//require('./site');
//require('./verify');


describe('Test admin.js', function() {

	var $controller, $scope;
	beforeEach(angular.mock.module('teamform-admin-app'));
	beforeEach(module('teamform-team-app'));
	beforeEach(inject(function(_$controller_,_$firebaseObject_, _$rootScope_){
		$controller = _$controller_;
		$firebaseObject = _$firebaseObject_;
		$scope = _$rootScope_.$new();
	}));
	/*beforeEach(function(){
		module('teamform-admin-app', ['firebase']);
			inject(function(_$rootScope_, _$controller_, _$firebaseObject_,_$firebaseArray_){
			myscope = _$rootScope_.$new();
			$firebaseObject = _$firebaseObject_;
			$firebaseArray = _$firebaseArray_;
			$controller = _$controller_;
			
		});
	});*/
	//initalizeFirebase();
	  //spyOn($scope.param.$loaded).andCallThrough();
	  describe('change min size Coverage Test', function() {
		  it('change min size to 3', function() {
			var $scope = {};		
			var controller = $controller('AdminCtrl', {$scope:$scope});
			//$scope.param = {};
			//$scope.UIDparam = {};
			var refPath, ref, eventName;
			eventName = getURLParameter("test");
			refPath = eventName + "/admin/param";	
			ref = firebase.database().ref(refPath);
			$scope.param = $firebaseObject(ref);

			//$scope.param.$loaded().then
			$scope.changeMinTeamSize(5);
			var minTeamSize = $scope.param.minTeamSize;
			expect(minTeamSize).toBe(5);
		  });
	  });
	  describe('change min size Coverage Test', function() {
		  it('change max size to 10', function() {
			//var $scope = {};
			//var controller = $controller('AdminCtrl',{$scope:$scope});
			//$scope.param = {};
			//$scope.UIDparam = {};
			var refPath, ref, eventName;
			eventName = "test";
			refPath = eventName + "/admin/param";	
			ref = firebase.database().ref(refPath);
			$scope.param = $firebaseObject(ref);
			
			//$scope.param.$loaded().then
			$scope.changeMaxTeamSize(9);
			expect($scope.param.maxTeamSize).toBe(9);
		  });
	  });
	  
	
}); 

   
   

describe('Test team.js', function() {

	var $controller, $scope;

	
	beforeEach(module('teamform-team-app'));
	beforeEach(inject(function(_$controller_,_$firebaseObject_){
		$controller = _$controller_;
		$firebaseObject = _$firebaseObject_;
	}));
	/*
	beforeEach(function(){
		module('teamform-team-app', ['firebase']);
			angular.mock.inject(function(_$rootScope_, _$controller_, _$firebaseObject_,_$firebaseArray_,$window){
			$scope = _$rootScope_.new();
			$firebaseObject = _$firebaseObject_;
			$firebaseArray = _$firebaseArray_;
			$controller = _$controller_('TeamCtrl', {$scope:$scope, $firebaseObject:$firebaseObject, $firebaseArray:$firebaseArray});
			
		});
	});*/
	//initalizeFirebase();

	describe('retrieveOnceFirebase Coverage Test', function() {
		  beforeEach(module('app', function ($provide) {
			$provide.value('$window', {
			   location: {
				 href: ''
			   }
			});
		  }));
		  it('should redirect to redirect page', function ($window) {
			var refPath = "events/test/admin";
			retrieveOnceFirebase(firebase, refPath, function(data){});
			expect($window.location.href).toContain('/redirect.html');
			}
		  );
	});
	  
	
}); 
