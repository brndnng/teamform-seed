$(document).ready(function(){

	$('#team_page_controller').hide();
	$('#modifyTeamSize').hide();
	$('#skills').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		
	}

});

//Getting team name from index.html
var getTeam = localStorage.getItem('_team');
if(getTeam != null)
localStorage.removeItem('_team');

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
	/*
		var haveTeamInThisEvent = false;
		var userID=document.getElementById('uid').textContent;
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
	*/
	$scope.requests = [];
	$scope.wantedSkills = [];
	$scope.invitedTeams = [];
	$scope.refreshViewRequestsReceived = function() {
		
		//$scope.test = "";		
		$scope.requests = [];
		$scope.filteredUsers = [];
		
		var teamID = $.trim( $scope.param.teamName );

		invited_refPath = "events/" + eventName + "/team/" + teamID + "/mergeRequests";
		$scope.invitedTeams = $firebaseArray(firebase.database().ref(invited_refPath));	

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
		var refPath = "events/" + getURLParameter("q") + "/team/" + teamID;	
		var ref = firebase.database().ref(refPath);
		var exists;
		ref.once("value").then(function(snapshot){
			exists=snapshot.hasChild("teamLeader");
			console.log(exists);
		});
		if (exists)
			return;
		else if ( teamID !== '') {
			var current_uid=document.getElementById('uid').textContent;
			var newData = {				
				'size': $scope.param.currentTeamSize,
				'teamMembers': $scope.param.teamMembers,
				'teamLeader': current_uid,
				//'wantedSkills': $scope.wantedSkills
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
				//rec.selection = [];
				$scope.wantedSkills.$save(rec);
				
				
				
			});*/

			
			//ref.set(newData, function(){			

				// console.log("Success..");
				
				// Finally, go back to the front-end
				// window.location.href= "index.html";
			//});
			ref.child("size").set($scope.param.currentTeamSize);
			ref.child("teamMembers").set($scope.param.teamMembers);
			ref.child("teamLeader").set(current_uid);
			
			
		}
		
		
	}
	
	$scope.loadFunc = function() {
		
		var teamID;
		//Team name from index.html
		if(getTeam != null)
			teamID = getTeam;
		else
			teamID = $.trim( $scope.param.teamName );		
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/team/" + teamID ;
		retrieveOnceFirebase(firebase, refPath, function(data) {	
			var current_uid=document.getElementById('uid').textContent;
			if (data.child("teamLeader").val() !=null){
				if(data.child("teamLeader").val()== current_uid){
					//window.alert("You don't have permission to edit this team!");
				$('#skills').show();
				$('#modifyTeamSize').show();
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
				}
				else 
					window.alert("You don't have permission to edit this team!");
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
			var index = $scope.requests.indexOf(r);
			$scope.requests.splice(index, 1); // remove that item
			$scope.saveFunc();
		}
	}
	
	$scope.removeMember = function(member) {
		
		var index = $scope.param.teamMembers.indexOf(member);
		if ( index > -1 ) {
			$scope.param.teamMembers.splice(index, 1); // remove that item
			
			var teamID = $.trim( $scope.param.teamName );	
			var joined_teamPath = "users/"	+ member +"/joined_teams/"+teamID;
			var joined_team_ref = firebase.database().ref(joined_teamPath);
			
			var eventName = getURLParameter("q");
			joined_team_ref.once("value").then(function(snapshot){
				
				if (snapshot.val() == eventName)
                	joined_team_ref.remove();
            	});
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
	
	$scope.inviteToTeam = function(user){
		var teamID = $.trim( $scope.param.teamName );	
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/member/" + user + "/invites";
		var invites_ref = firebase.database().ref(refPath);
		//check if user is in team
		if ($scope.param.teamMembers.indexOf(user) >= 0){
			var repeatedNotice = "User already in team.";
			window.alert(repeatedNotice);
			return;
		}

		invites_ref.once("value").then(function(snapshot){
            // Check if member is invited
            var hasInvite = snapshot.hasChild(teamID);
            // If not invited, send invite
            if(!hasInvite){
                invites_ref.child(teamID).set(teamID);
                invite = "success"
            }
            else{
            	//Invited already
                var repeatedNotice = "User already invited.";
                invite = "success";
                window.alert(repeatedNotice);
            }
        });
	};
	
	$scope.requestToMerge = function(teamToMerge,teamSize,teamMembers){
		var teamID = $.trim( $scope.param.teamName );
		var eventName = getURLParameter("q");
		var refPath = "events/" + eventName + "/team/" + teamToMerge + "/mergeRequests";
		var invites_ref = firebase.database().ref(refPath);
		//console.log(teamMembers.length);
		//console.log($scope.param.teamMembers.length);
		//console.log($scope.param.currentTeamSize);
		invites_ref.once("value").then(function(snapshot){
            // Check if merge invite is sent
            var hasInvite = snapshot.hasChild(teamID);
            // If not invited, send invite
            if(!hasInvite){
            	if (teamMembers.length + $scope.param.teamMembers.length <= $scope.param.currentTeamSize){
                	invites_ref.child(teamID).set(teamID);
                	invite = "success";
            	}
            	else {
            		var repeatedNotice = "Merged team size will exceed Prefered team size.";
                	invite = "success";
                	window.alert(repeatedNotice);
                }
            }
            else{
            	//Invited already
                var repeatedNotice = "Team already invited.";
                invite = "success";
                window.alert(repeatedNotice);
            }
        });
	};

	$scope.acceptMerge = function(teamToMerge){
		var teamID = $.trim( $scope.param.teamName );
		var eventName = getURLParameter("q");

		var teamToMerge_refPath = "events/" + eventName + "/team/" + teamToMerge;
		var teamToMerge_ref = firebase.database().ref(teamToMerge_refPath);
		var teamToMerge_members;

		var refPath = "events/" + eventName + "/team/";
		var ref = firebase.database().ref(refPath);

		var refPath = "events/" + eventName + "/team/" + teamID + "/mergeRequests";
		var invites_ref = firebase.database().ref(refPath);

		/*teamToMerge_ref.once("value").then(function (snapshot){
			teamToMerge_members = snapshot.child("teamMembers").numChildren();
			console.log(teamToMerge_members);
			console.log($scope.param.teamMembers.length);
			console.log($scope.param.currentTeamSize);
		});*/

		
			teamToMerge_ref.once("value").then(function (snapshot){
				teamToMerge_members = snapshot.child("teamMembers").numChildren();
				if ($scope.param.teamMembers.length + teamToMerge_members <= $scope.param.currentTeamSize){
				//add teamToMerge members to current team
				var hasTeamMembers = snapshot.hasChild("teamMembers");
				if (hasTeamMembers){
					//for each member in teamToMerge
					snapshot.child("teamMembers").forEach(function(childSnapshot){
						var memberID = childSnapshot.val();
						if ($scope.param.teamMembers.indexOf(memberID) < 0){
							$scope.param.teamMembers.push(memberID);
							
							//update joined_team of member
							var joined_teamsPath = "users/"	+ memberID +"/joined_teams";
							var joined_teams_ref = firebase.database().ref(joined_teamsPath);
							joined_teams_ref.once("value").then(function(s){
								//remove original joined_team
								if (s.child(teamToMerge).val() == eventName)
	                				joined_teams_ref.child(teamToMerge).remove();
	                			//add new joined_team
	           					var hasTeam = s.hasChild(teamID);
	            				if (!hasTeam)
	                				joined_teams_ref.child(teamID).set(eventName);
	       					});
						}
						
					});
				}
				//add teamToMerge wantedSkills to current team
	            var hasSkill = snapshot.hasChild("wantedSkills");
	            if(hasSkill){
	            	//for each skill in teamToMerge
	            	snapshot.child("wantedSkills").forEach(function(childSnapshot){
	            		var skill = childSnapshot.val();
	            		var skills_refPath = "events/" + eventName + "/team/" + teamID + "/wantedSkills";
	            		var skills_ref = firebase.database().ref(skills_refPath);
	        			skills_ref.once("value").then(function(s){
	        				var matchSkill = s.hasChild(skill);
	            			// If it does not exist, then add skill
	            			if(!matchSkill)
	                			skills_ref.child(skill).set(skill);
	        			});
	            	});
	            }
	            //remove team merge request
	            invites_ref.once("value").then(function(snapshot){
					invites_ref.child(teamToMerge).remove();
				});
				//delete teamToInvite
				teamToMerge_ref.once("value").then(function (snapshot){
					ref.child(teamToMerge).remove();
					ref.child(teamID).child("teamMembers").set($scope.param.teamMembers);
				});
	        }
	        else {
            var repeatedNotice = "Merged team size will exceed Prefered team size.";
          	invite = "success";
            window.alert(repeatedNotice);
       		};
		});
       	
       	    	
	};
		
}]);

window.onload = function() {
  angular.element(document.getElementById('teamform-team-app')).scope().loadFunc();
};