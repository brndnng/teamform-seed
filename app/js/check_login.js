  var initApp = function() {initalizeFirebase();
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var providerData = user.providerData;
            // Add refPath of user to users
            var refPath = "users/";
            var ref = firebase.database().ref(refPath);
            var key = ref.key;
            // Check if UID exists in firebase
            ref.once("value").then(function(snapshot){
              var hasUser = snapshot.hasChild(user.uid);
              if (!hasUser){
                var newUser = ref.child(user.uid).set(
                  {"name":user.displayName,
                   "skills":"(placeholder)",
                   "interests":"(placeholder)",
                   "email": user.email
                   //"joined_events": "(placeholder)",
                   //"events_admin": "(placeholder)"

                });
              }
            });
			      localStorage.setItem('_uid', user.uid);

            user.getToken().then(function(accessToken) {
              document.getElementById('sign-in-status').textContent = 'Signed in';
              //document.getElementById('user-info').style.display = 'block';
              document.getElementById('name').textContent = user.displayName;
              document.getElementById('email').textContent = user.email;
              document.getElementById('showInfo').style.display = 'block';

              //show Info
              var query = firebase.database().ref("users/").orderByKey();
              query.once("value").then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {

                    if(childSnapshot.key==user.uid){ //check user id
                      // childData will be the actual contents of the child
                      var userSource = childSnapshot.val();

                      var joinevent=[], isEventAdmin=[]; //variable for events
                      var jointeam=[],isTeamLeader=[],fromEvent=[]; //variable for teams

                      if(userSource.events_admin) //Adding Event Admin
                      {
                        var keys = Object.keys(userSource.events_admin);
                        for(var i=0;i<keys.length;i++)
                          if(Object.values(userSource.events_admin)[i])
                            {
                              joinevent.push(keys[i]);
                              isEventAdmin.push(true);
                            }
                      }

                      if(userSource.events_teamLeader) //Adding TeamLeader info
                      {
                        var keys = Object.keys(userSource.events_teamLeader);
                        var values = Object.values(userSource.events_teamLeader);
                        for(var i=0;i<keys.length;i++)
                          { 
                            jointeam.push(keys[i]);
                            isTeamLeader.push(true);
                            fromEvent.push(values[i]);
                          }
                      }

                      if(userSource.joined_events) //Adding Event info
                      {
                        var keys = Object.keys(userSource.joined_events);
                        for(var i=0;i<keys.length;i++){
                          if(Object.values(userSource.joined_events)[i])
                            if(joinevent.indexOf(keys[i]) == -1) //He is not in event before
                            {
                              joinevent.push(keys[i]);
                              isEventAdmin.push(false);
                            }
                        }
                      }

                      if(userSource.joined_teams) //Adding Teammember info
                      {
                        var keys = Object.keys(userSource.joined_teams);
                        var values = Object.values(userSource.joined_teams);
                        for(var i=0;i<keys.length;i++){
                          if(jointeam.indexOf(keys[i]) == -1)
                          {
                            jointeam.push(keys[i]);
                            isTeamLeader.push(false);
                            fromEvent.push(values[i]);
                          }
                        }
                      }

                      //Print out the info
                      document.getElementById('showInfo').innerHTML += "<h3>Event :</h3>";
                      if(joinevent.length==0)
                        document.getElementById('showInfo').innerHTML += "(none)";
                      else
                        for(var i=0;i<joinevent.length;i++)
                        {
                          document.getElementById('showInfo').innerHTML += "<b><a href=\"team.html?q=" + joinevent[i] + "\">" + joinevent[i] + "</a></b> ";
                          if(isEventAdmin[i])
                            document.getElementById('showInfo').innerHTML += "<b><a href=\"admin.html?q=" + joinevent[i] + "\">" + "<span class=\"label label-primary\">Admin</span></a>";
                          document.getElementById('showInfo').innerHTML += "<br>";
                        }

                      document.getElementById('showInfo').innerHTML += "<h3>Team :</h3>";
                      if(jointeam.length==0)
                        document.getElementById('showInfo'.innerHTML) += "(none)";
                      else
                        for(var i=0;i<jointeam.length;i++)
                        {
                          document.getElementById('showInfo').innerHTML += "<a href=\"javascript:passTeamName('" + jointeam[i] + "','"+ fromEvent[i] + "');\"><b>" + jointeam[i] + "</b></a> (from " + fromEvent[i] + ") ";
                          if(isTeamLeader[i])
                            document.getElementById('showInfo').innerHTML += "<span class=\"label label-primary\">Leader</span>";
                          else
                            document.getElementById('showInfo').innerHTML += "<span class=\"label label-info\">Member</span>";
                          document.getElementById('showInfo').innerHTML += "<br>";
                        }
                    }
                      //break;
                });
              });

              if (user.photoURL){
                document.getElementById('photo').src = user.photoURL;
                document.getElementById('photo').style.display = 'block';
              } 
              else {
                photoURL = 'placeholder.svg';
                document.getElementById('photo').src = photoURL;
                document.getElementById('photo').style.display = 'block';
              }
              /*document.getElementById('account-details').textContent = JSON.stringify({
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                photoURL: photoURL,
                uid: uid,
                accessToken: accessToken,
                providerData: providerData
              }, null, '  ');*/


            });
          } else {
            // User is signed out.
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('name').textContent = '';
            document.getElementById('photo').style.display = 'none';
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('showInfo').style.display = 'none';
            document.getElementById('showInfo').innerHTML = "";
			      var checkUID = localStorage.getItem('_uid');
			      if(checkUID!=null)
				      localStorage.removerItem('_uid');
          }
        }, function(error) {
          console.log(error);
        });
        document.getElementById('sign-out').addEventListener('click', function() {
           firebase.auth().signOut();
        });
      };

      window.addEventListener('load', function() {
        initApp()
      });
//Passing Team Name to teampage
function passTeamName(T,E) {
  var url = "team.html?q=" + E;
  localStorage.setItem('_team', T);
  window.location.href = url;
}
