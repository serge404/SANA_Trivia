function logOut() {
firebase.auth().signOut().then(function() {
  window.location="login.html";
})
}
