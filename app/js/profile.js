$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {

            document.getElementById('name').textContent = user.displayName;
            document.getElementById('email').textContent = user.email;

            if (user.photoURL){
            	document.getElementById('photo').src = user.photoURL;
            	document.getElementById('photo').style.display = 'block';
          	} else {
    			photoURL = 'placeholder.svg';
            	document.getElementById('photo').src = photoURL;
    			document.getElementById('photo').style.display = 'block';
          	}
		}
		else {

		}

       
	});
}); 

angular.module('teamform-profile-app', ['firebase'])
.controller('ProfileCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {

	// Call Firebase initialization code defined in site.js
	initalizeFirebase();


	var logged_in=getUID();
    var refPath;

    // Get the database path
    refPath = "users/" + getURLParameter("q") + "/interests";
    $scope.interests = [];
    $scope.interests = $firebaseArray(firebase.database().ref(refPath));

    
    refPath = "users/" + getURLParameter("q") + "/skills";
    $scope.skills = [];
    $scope.skills = $firebaseArray(firebase.database().ref(refPath));


    $scope.addInterest = function(){
        // Get the user's input
        var newInterest = $('#newInterest').val();
        // Set the database's path
        refPath = "users/" + getURLParameter("q") + "/interests";
        // Link to the database
        var interests_ref = firebase.database().ref(refPath);
        interests_ref.once("value").then(function(snapshot){
            // Check the existence of newInterest
            var hasInterest = snapshot.hasChild(newInterest);
            // If it does not exist, then add newInterest
            if(!hasInterest){
                interests_ref.child(newInterest).set(true);
            }
            else{
                var repeatedNotice = "\"" + newInterest + "\" already exists.";
                window.alert(repeatedNotice);
            }
        });

        // Clear input box after adding
        $('#newInterest').val("");
    }


    $scope.removeInterest = function(rmInterest){
        refPath = "users/" + getURLParameter("q") + "/interests";
        var interests_ref = firebase.database().ref(refPath);
        interests_ref.once("value").then(function(snapshot){

            // Check whether it is the last item in interests[]
            if($scope.interests.length == 1){
                refPath = "users/" + getURLParameter("q");
                interests_ref = firebase.database().ref(refPath);
                interests_ref.child("interests").set("(placeholder)");
            }

            // Remove selected item
            interests_ref.child(rmInterest.$id).remove();

        });
    }


    $scope.addSkill = function(){
        // Get the user's input
        var newSkill = $('#newSkill').val();
        // Set the database's path
        refPath = "users/" + getURLParameter("q") + "/skills";
        // Link to the database
        var skills_ref = firebase.database().ref(refPath);
        skills_ref.once("value").then(function(snapshot){
            // Check the existence of newSkill
            var hasSkill = snapshot.hasChild(newSkill);
            // If it does not exist, then add newSkill
            if(!hasSkill){
                skills_ref.child(newSkill).set(true);
            }
            else{
                var repeatedNotice = "\"" + newSkill + "\" already exists.";
                window.alert(repeatedNotice);
            }
        });

        // Clear input box after adding
        $('#newSkill').val("");
    }


    $scope.removeSkill = function(rmSkill){
        refPath = "users/" + getURLParameter("q") + "/skills";
        var skills_ref = firebase.database().ref(refPath);
        skills_ref.once("value").then(function(snapshot){

            // Check whether it is the last item in skills[]
            if($scope.skills.length == 1){
                refPath = "users/" + getURLParameter("q");
                skills_ref = firebase.database().ref(refPath);
                skills_ref.child("skills").set("(placeholder)");
            }

            // Remove selected item
            skills_ref.child(rmSkill.$id).remove();

        });
    }


}]);