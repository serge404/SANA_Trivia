function login() {

  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  
        .then(result =>{
        const user = result.user;
        console.log(user)
        window.location ="hello.html";
    
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });
}

function googleSignIn() {
   // Start a sign in process for an unauthenticated user.
    var provider = new firebase.auth.GoogleAuthProvider();
     provider.addScope('profile');
     provider.addScope('email');
     auth.signInWithRedirect(provider);
     
     auth.getRedirectResult().then(function(result) {
     if (result.credential) {
       // This gives you a Google Access Token.
       var token = result.credential.accessToken;
    }
     var user = result.user;
    })
}

auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        user.providerData.forEach(function (profile) {
        db.collection("users").doc(profile.displayName).set({email: profile.email});
        console.log("Provider-specific UID: " + profile.uid);
        })
      }
      else {
        console.log("No User");
      }
});


