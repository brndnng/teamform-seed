$(document).ready(function(){


    $("#btn_admin").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "admin.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_leader").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "team.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_member").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "member.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });


});


function openProfile(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var current_uid = user.uid;
            if ( current_uid !== ''){
                var url = "profile.html?q=" + current_uid;
                window.location.href = url;
            }
        }
        else {
            window.alert("Please login.");
        }
    });

}