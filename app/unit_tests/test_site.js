'use strict';
//var MockFirebase = require('mockfirebase').MockFirebase;
//MockFirebase.override();
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
	var $controller, $scope, $firebaseObject, $firebaseArray, $firebaseUtils;
	//beforeEach(angular.mock.module('teamform-admin-app'));
	beforeEach(function() {
		module('firebase');
		module('teamform-admin-app');
	});
	beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();        
	}));
	beforeEach(inject(function(_$controller_,_$firebaseObject_,_$firebaseArray_, _$firebaseUtils_){
		$controller = _$controller_;
		$firebaseObject = _$firebaseObject_;
		$firebaseArray = _$firebaseArray_;
		$firebaseUtils = _$firebaseUtils_;
		//initalizeFirebase();

	}));
/*
	  describe('change min size Coverage Test', function() {
		  it('change min size to 3', function() {
			var $scope = {};		
			var controller = $controller('AdminCtrl', {$scope:$scope});
			var refPath, ref, eventName;
			eventName = getURLParameter("test");
			refPath = eventName + "/admin/param";	
			ref = firebase.database().ref(refPath);
			$scope.param = $firebaseObject(ref);

			$scope.changeMinTeamSize(5);
			var minTeamSize = $scope.param.minTeamSize;
			expect(minTeamSize).toBe(5);
		  });
	  });
	  describe('change min size Coverage Test', function() {
		  it('change max size to 10', function() {
			var refPath, ref, eventName;
			eventName = "test";
			refPath = eventName + "/admin/param";	
			ref = firebase.database().ref(refPath);
			$scope.param = $firebaseObject(ref);
			$scope.changeMaxTeamSize(9);
			expect($scope.param.maxTeamSize).toBe(9);
		  });
	  });
*/
initalizeFirebase();
	  describe('create and remove firebase object', function() {
		it('should work on a query', function(done) {

  //firebase.initializeApp(config);
  			  		

		  var ref =  stubRef();
		  //var ref = testApp.database().ref("/unit_test").push();
		  ref.set({foo: 'bar'});
		  var query = ref.limitToLast(3); 
		  var obj = $firebaseObject(query);  // create a firebase object

		  obj.$loaded().then(function () {  // the callback function
			expect(obj.foo).toBe('bar');  // we only test the value when the firebase object is ready
		  }).then(function () {
			return obj.$remove();
		  }).then(function () {
			expect(obj.$value).toBe(null);
			done();
		  });
		});
	  });
	  
	describe('change min size Coverage Test', function() {
		  it('should change min size to 3', function(done) {
		  	//initalizeFirebase();
		  var ref = stubRef();
		  //var ref = testApp.database().ref("/unit_test").push();
//		  ref.set({param.mixTeamSize: 1});
		  var query = ref.limitToLast(3); 
		  var obj = $firebaseObject(query);  // create a firebase object

		  obj.$loaded().then(function (data) {  // the callback function
		    obj.changeMinTeamSize(9)
			expect(obj.param.maxTeamSize).toBe('9');  // we only test the value when the firebase object is ready
		  }).then(function () {
			return obj.$remove();
		  });
		});
	});
	
}); 

   
   
/*
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
	});
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
*/

function stubRef() {
	return firebase.database().ref().push();
  		};