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
   


describe('teamform-admin-app', function() {

	var $controller, $scope;

	beforeEach(function(){
		module('teamform-admin-app', 'firebase');
			inject(function(_$rootScope_, _$controller_, _$firebaseObject_,_$firebaseArray_){
			myscope = _$rootScope_.$new();
			$firebaseObject = _$firebaseObject_;
			$firebaseArray = _$firebaseArray_;
			$controller = _$controller_;
		});
	});
	


	  it('change min size to 3', function() {
	  	var myscope = {};		
		var controller = $controller('AdminCtrl',{$scope:myscope});
		var testarray = $firebaseArray;
		myscope.param = {};
		//initalizeFirebase();
		var refPath, ref, eventName;
		eventName = "test";
		refPath = eventName + "/admin/param";	
		ref = firebase.database().ref(refPath);
		myscope.param = $firebaseObject(ref);
		
		//$scope.param.$loaded().then;
		myscope.changeMinTeamSize(3);
	  	expect(myscope.param.minTeamSize).toBe(3);
	  });
	  
	  it('change max size to 10', function() {
	  	var myscope = {};
		var controller = $controller('AdminCtrl',{$scope:$scope});
		
		$scope.param = {};
		var refPath, ref, eventName;
		eventName = "test";
		refPath = eventName + "/admin/param";	
		ref = firebase.database().ref(refPath);
		
		//$scope.param.$loaded().then
	  	$scope.changeMaxTeamSize(9);
	  	expect($scope.param.maxTeamSize).toBe(9);
	  });
	  
	  
});   
   
});
