function addQuestion() {
    var question = document.getElementById("question-id").value;
    var answer = document.getElementById("answer-id").value;
     var choice1 = document.getElementById("firstchoice").value;
     var choice2 = document.getElementById("secondchoice").value;
     var choice3 = document.getElementById("thirdchoice").value;
     var choice4 = document.getElementById("fourthchoice").value;
    
    console.log(answer);
    var user = auth.currentUser;
    user.providerData.forEach(function (profile) {
        db.collection("users").doc(profile.displayName).set({questions: question}).then(function() {
            console.log("Document successfully written!");
        });
      });
}

