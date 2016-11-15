$(document).ready(function(){

	$('#team_page_controller').hide();
	$('#skills').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		
	}

});

angular.module('teamform-team-app', ['firebase'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {
		
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	

	var logged_in=getUID();
	

	var refPath = "";

	var eventName = getURLParameter("q");	
	
	// TODO: implementation of MemberCtrl	
	$scope.param = {
		"teamName" : '',
		"currentTeamSize" : 0,
		"teamMembers" : [],
		"teamLeader" : '',
	};
		
	

	refPath =  "events/" + eventName + "/admin";
	retrieveOnceFirebase(firebase, refPath, function(data) {	
			if (!checkLoginstate()){
		//window.alert("Please login");
		window.location.href= "redirect.html";
	}
		if ( data.child("param").val() != null ) {
			$scope.range = data.child("param").val();
			$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			//$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			$scope.$apply(); // force to refresh

			$('#team_page_controller').show(); // show UI
			
		} 
	});
	
	
	refPath = "events/" + eventName + "/member";	
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));
	
	
	refPath = "events/" + eventName + "/team";	
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));
	
	refPath = "users/";
	$scope.users = [];
	$scope.users = $firebaseArray(firebase.database().ref(refPath));
	$scope.filteredUsers = [];

	/*for (i=0; i<$scope.users.length; i++){
		console.log($scope.users.$id);
	}*/
	/*$.each($scope.member, function(i,mobj){
		console.log(5);
		$.each($scope.users, function(i,obj){
			if (obj.$id == mobj.$id)
				$scope.filteredUsers.push(obj);
				console.log(mobj.$id);

		});
		$scope.apply();
	});*/

	//Meeting()
	var haveTeamInThisEvent = false;
	var meeting_teamsPath = "users/"	+ userID +"/joined_teams";
	var meeting_teams_ref = firebase.database().ref(meeting_teamsPath);

	var meeting_teams_array = $firebaseArray(meeting_teams_ref);
	console.log(meeting_teams_array);
	var teamKeys =  Object.keys(meeting_teams_array);
	var teamvalues = Object.values(meeting_teams_array);
	var eventIndex = teamvalues.indexOf(eventName);
	var meeting_ref = firebase.database().ref("meeting");
	$scope.meeting_array = $firebaseArray(meeting_ref);
	$scope.meeting_show = {
		event: "",
		team: "",
		desc: "",
		holddate: "",
		joins: 0
	};
	if(eventIndex!=-1)
	haveTeamInThisEvent = true;
	if(haveTeamInThisEvent)
	{
		document.getElementById('meeting').style.display = 'block';
		$scope.isTeamLeader;
		if($scope.team[$scope.team.indexOf(teamKeys[eventIndex])].teamLeader == getUID())
			$scope.isTeamLeader=true;
		else
			$scope.isTeamLeader=false;
		
		var meeting_index;
		//check first meeting is held before or not
		for(meeting_index=0;meeting_index<$scope.meeting_array.length;meeting_index++)
			if($scope.meeting_array[meeting_index].event==eventName)
				{
					$scope.meeting_show=Object.assign({},$scope.meeting_array[meeting_index]);
					break;
				}
		if(meeting_index == $scope.meeting_array.length)
			document.getElementById('firstMeetingShow').style.display = 'none';
		else
			document.getElementById('firstMeetingShow').style.display = 'block';
		$scope.meetinginput = {
			event: "",
			team: "",
			desc: "",
			holddate: "",
			joins: 0
		};

	}
	else
		document.getElementById('meeting').style.display = 'none';

	$scope.addMeeting = function() {
			
			// update the date
			if ($scope.meetinginput.desc != "" && $scope.meetinginput.holddate !="" && $scope.isTeamLeader) {
				$scope.meetinginput.holddate = $scope.meetinginput.holddate.toString();
				$scope.meetinginput.joins = 0;
				// add an input question
				$scope.meeting_array.$add($scope.meetinginput);
				$scope.meeting_show=Object.assign({},$scope.meetinginput);
				document.getElementById('firstMeetingShow').style.display = 'block';
			}
		}

	$scope.addjoins = function() {
		$scope.meeting_show.joins ++;
		for(var i=0;i<$scope.meeting_array.length;i++)
			if($scope.meeting_show.event==$scope.meeting_array[i].event&&$scope.meeting_show.team==$scope.meeting_array[i].team)
				$scope.meeting_array[i].joins++;
		$scope.meeting_array.$save();
	}

	$scope.showDate = function(v1) {
		var d1 = new Date(v1);
		return d1.toDateString();
		}

	$scope.showTime = function(v1) {
			var d1 = new Date(v1);
			return d1.toLocaleTimeString();
		}
	//End of Meeting()


	$scope.requests = [];
	$scope.wantedSkills = [];
	$scope.refreshViewRequestsReceived = function() {
		
		//$scope.test = "";		
		$scope.requests = [];
		$scope.filteredUsers = [];
		
		var teamID = $.trim( $scope.param.teamName );	
				
		$.each($scope.member, function(i,obj) {			
			//$scope.test += i + " " + val;
			//$scope.test += obj.$id + " " ;
			
			var userID = obj.$id;
			if ( typeof obj.selection != "undefined"  && obj.selection.indexOf(teamID) > -1 ) {
				//$scope.test += userID + " " ;
				
				$scope.requests.push(userID);

				var joined_teamsPath = "users/"	+ userID +"/joined_teams";
				var joined_teams_ref = firebase.database().ref(joined_teamsPath);
			
				joined_teams_ref.once("value").then(function(snapshot){
					//var teamName = teamID;
              		var hasTeam = snapshot.hasChild(teamID);
              		if (!hasTeam)
                		joined_teams_ref.child(teamID).set(getURLParameter("q"));
            	});
			}
			$.each($scope.users, function(i,mobj){
				var m = mobj.$id;
				if(m===userID) {
           		$scope.filteredUsers.push(mobj);
           		} 
			});
		});
		
		$scope.$apply();

	}
	
	
	
	
	
	

	$scope.changeCurrentTeamSize = function(delta) {
		var newVal = $scope.param.currentTeamSize + delta;

		if (newVal >= $scope.range.minTeamSize && newVal <= $scope.range.maxTeamSize ) {
			$scope.param.currentTeamSize = newVal;
		} 

	}

	$scope.saveFunc = function() {
		
		
		var teamID = $.trim( $scope.param.teamName );
		
		if ( teamID !== '' ) {
			var current_uid=document.getElementById('uid').textContent;
			var newData = {				
				'size': $scope.param.currentTeamSize,
				'teamMembers': $scope.param.teamMembers,
				'teamLeader': current_uid,
			};		
			
			var refPath = "events/" + getURLParameter("q") + "/team/" + teamID;	
			var ref = firebase.database().ref(refPath);
			var events_teamPath = "users/"	+ current_uid +"/events_teamLeader";
			var events_team_ref = firebase.database().ref(events_teamPath);
			
			events_team_ref.once("value").then(function(snapshot){
				//var teamName = teamID;
              	var hasTeam = snapshot.hasChild(teamID);
              	if (!hasTeam)
                	events_team_ref.child(teamID).set(getURLParameter("q"));
            });
			// for each team members, clear the selection in /[eventName]/team/
			
			$.each($scope.param.teamMembers, function(i,obj){
				
				
				//$scope.test += obj;
				var rec = $scope.member.$getRecord(obj);
				rec.selection = [];
				$scope.member.$save(rec);
				
				
				
			});
			// for each wanted skills
			/*$.each($scope.wantedSkills, function(i,obj){
				
				
				//$scope.test += obj;
				var rec = $scope.wantedSkills.$getRecord(obj);
				rec.selection = [];
				$scope.wantedSkills.$save(rec);
				
				
				
			});*/

			
			ref.set(newData, function(){			

				// console.log("Success..");
				
				// Finally, go back to the front-end
				// window.location.href= "index.html";
			});
			
			
			
		}
		
		
	}
	
	$scope.loadFunc = function() {
		$('#skills').show();
		var teamID = $.trim( $scope.param.teamName );		
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/team/" + teamID ;
		retrieveOnceFirebase(firebase, refPath, function(data) {	
			var current_uid=document.getElementById('uid').textContent;
			if (data.child("teamLeader").val() !=null){
				if(data.child("teamLeader").val()!= current_uid)
					window.alert("You don't have permission to edit this team!");
			}
			if ( data.child("size").val() != null ) {
				
				$scope.param.currentTeamSize = data.child("size").val();
				
				$scope.refreshViewRequestsReceived();
								
				
			} 
			
			if ( data.child("teamMembers").val() != null ) {
				
				$scope.param.teamMembers = data.child("teamMembers").val();
				
			}
			if ( data.child("wantedSkills").val() != null) {
				$scope.wantedSkills = $firebaseArray(firebase.database().ref(refPath+"/wantedSkills"));
			}
			$scope.$apply(); // force to refresh
		});

	}
	
	$scope.changeFunc = function() {
		
		var teamID = $.trim( $scope.param.teamName );		
		if ( teamID !== '' ) {
			
			//var newData = {				
			//	'size': $scope.param.currentTeamSize,
			//	'teamMembers': $scope.param.teamMembers
			//};		
			
			var refPath = "events/" + getURLParameter("q") + "/team/" + teamID + "/size";	
			var ref = firebase.database().ref(refPath);
			
			
			
			if ($scope.param.teamMembers.length <= $scope.param.currentTeamSize)
				ref.set($scope.param.currentTeamSize);
			else{
				window.alert("Cannot set team size less than number of members!");
				var difference = $scope.param.teamMembers.length - $scope.param.currentTeamSize;
				$scope.changeCurrentTeamSize(difference);
			}
			
			
		}

	}

	$scope.processRequest = function(r) {
		//$scope.test = "processRequest: " + r;
		
		if ( 
		    $scope.param.teamMembers.indexOf(r) < 0 && 
			$scope.param.teamMembers.length < $scope.param.currentTeamSize  ) {
				
			// Not exists, and the current number of team member is less than the preferred team size
			$scope.param.teamMembers.push(r);
			
			$scope.saveFunc();
		}
	}
	
	$scope.removeMember = function(member) {
		
		var index = $scope.param.teamMembers.indexOf(member);
		if ( index > -1 ) {
			$scope.param.teamMembers.splice(index, 1); // remove that item
			
			$scope.saveFunc();
		}
		
	}
	$scope.addSkill = function(){
        // Get the user's input
        var newSkill = $('#newSkill').val();
        // Set the database's path
        var teamID = $.trim( $scope.param.teamName );		
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/team/" + teamID + "/wantedSkills";
        //refPath = "users/" + getURLParameter("q") + "/skills";
        // Link to the database
        var skills_ref = firebase.database().ref(refPath);
        skills_ref.once("value").then(function(snapshot){
            // Check the existence of newSkill
            var hasSkill = snapshot.hasChild(newSkill);
            // If it does not exist, then add newSkill
            if(!hasSkill){
                skills_ref.child(newSkill).set(newSkill);
            }
            else{
                var repeatedNotice = "\"" + newSkill + "\" already exists.";
                window.alert(repeatedNotice);
            }
        });

        // Clear input box after adding
        $('#newSkill').val("");
        $scope.wantedSkills = $firebaseArray(firebase.database().ref(refPath));
    };
	
	$scope.removeSkill = function(rmSkill){
		var teamID = $.trim( $scope.param.teamName );		
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/team/" + teamID + "/wantedSkills";
        //refPath = "users/" + getURLParameter("q") + "/skills";
        var skills_ref = firebase.database().ref(refPath);

        /*var index = $scope.param.wantedSkills.indexOf(rmSkill);
        if ( index > -1 ) {
			$scope.param.wantedSkills.splice(index, 1); // remove that item
			
			$scope.saveFunc();
		};*/
        skills_ref.once("value").then(function(snapshot){

            // Check whether it is the last item in skills[]
            /*if($scope.wantedSkills.length == 1){
                refPath = "users/" + getURLParameter("q");
                skills_ref = firebase.database().ref(refPath);
                skills_ref.child("skills").set("(placeholder)");
            }*/

            // Remove selected item
            skills_ref.child(rmSkill.$id).remove();

        });
    };
	
	
	
	
		
}]);