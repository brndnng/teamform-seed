$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});

angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of MemberCtrl
	
	
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	var userUID, userName;
		firebase.auth().onAuthStateChanged(function(user){
		if (user) {
		$scope.userID = user.uid;
		$scope.userName = user.displayName;	
		//$scope.teams = {};
		var invited_refPath = "events/" + getURLParameter("q") + "/member/" + $scope.userID + "/invites";
		var invited_ref = firebase.database().ref(invited_refPath);
		$scope.invitedTeams = $firebaseArray(invited_ref);
		console.log(invited_refPath);
		//console.log($scope.invitedTeams);
		}
		else{
			$scope.userID = "";
			$scope.userName = "";	
			//$scope.teams = {};
			//window.alert("Please login");
			window.location.href= "redirect.html";
		}
	})	

	//$scope.userID = "";
	//$scope.userName = "";	
	$scope.teams = {};
	$scope.teamMembers = [];
	$scope.currentTeamSize = 0;
	//$scope.invitedTeams = {};
		//if (!checkLoginstate()){
		//window.alert("Please login");
		//window.location.href= "index.html";
		//}	
	
	
	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {
			
			var refPath = "events/" + getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {

				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}
				
				
				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}
	
	$scope.saveFunc = function() {
		
		
		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );
		
		if ( userID !== '' && userName !== '' ) {
									
			var newData = {				
				'name': userName,
				'selection': $scope.selection
			};
			
			var refPath = "events/" + getURLParameter("q") + "/member/" + userID;	
			var ref = firebase.database().ref(refPath);
			
			var joined_eventsPath = "users/"	+ userID +"/joined_events";
			var joined_events_ref = firebase.database().ref(joined_eventsPath);
			
			joined_events_ref.once("value").then(function(snapshot){
				//var teamName = teamID;
              	var hasEvent = snapshot.hasChild(getURLParameter("q"));
              	if (!hasEvent)
                	joined_events_ref.child(getURLParameter("q")).set(true);
            });

			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");
				
				// Finally, go back to the front-end
				window.location.href= "index.html";
			});
			
			
		
					
		}
	}
	
	$scope.refreshTeams = function() {
		var userID = $.trim( $scope.userID );
		var refPath = "events/" + getURLParameter("q") + "/team";	
		var ref = firebase.database().ref(refPath);

		
		// Link and sync a firebase object
		$scope.selection = [];		
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);    
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}
	
	
		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {
								
							
							
			}) 
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});
			
		
	}
	$scope.acceptInvite = function(teamID){
		//add member to /events/<event>/team/<team>/teamMembers
		//remove entry in /events/<event>/member/<UID>/invites/<team>
		var userID = $.trim( $scope.userID );
		var refPath = "events/" + getURLParameter("q") + "/team/" + teamID ;
		var ref = firebase.database().ref(refPath);
		console.log(refPath);
		var invited_refPath = "events/" + getURLParameter("q") + "/member/" + userID + "/invites";
		console.log(invited_refPath);
		var invited_ref = firebase.database().ref(invited_refPath);
		$scope.invitedTeams = $firebaseArray(invited_ref);


		$scope.teamMembers = [];
		
		ref.once("value").then(function(snapshot) {
			if ( snapshot.child("size").val() != null ) {
				$scope.currentTeamSize = snapshot.child("size").val();
			}
			if ( snapshot.child("teamMembers").val() != null ) {
				$scope.teamMembers = snapshot.child("teamMembers").val();
			}
			if ($scope.teamMembers.length < $scope.currentTeamSize  ) {
				
			// Not exists, and the current number of team member is less than the preferred team size
				$scope.teamMembers.push(userID);
			//onsole.log($scope.teamMembers);
			
				var index = $scope.invitedTeams.indexOf(teamID);
				$scope.invitedTeams.splice(index, 1);
			//console.log($scope.invitedTeams);	
			};
			ref.child("teamMembers").set($scope.teamMembers);
		});
		
		invited_ref.once("value").then(function(snapshot){
			invited_ref.child(teamID).remove();
		});
		//$scope.$apply();
	};
	
	$scope.refreshTeams(); // call to refresh teams...

}]);