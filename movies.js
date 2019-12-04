$(document).ready(function() {
  var questionsList = [
    {
      text: "What is the name of the song that Queen Elsa sings as she builds her ice castle in the movie Frozen?",
      choices: [
        "Snowflakes",
        "Fell in Love",
        "Snowfall",
        "Let It Go"
      ],
      correctChoiceIndex: 3
    },
    {
      text: "Which popular TV show featured House Targaryen and Stark?",
      choices: [
        "The Good Place",
        "The 100",
        "Stranger Things",
        "Game of Thrones"
      ],
      correctChoiceIndex: 3
    },
    {
      text: "How many films did Sean Connery play James Bond in?",
      choices: [
          "4", "7", "5", "9"],
      correctChoiceIndex: 1,
    },
    {
      text: "What was the name of the family who starred in 7th Heaven?",
      choices: ["The Camdens",
      "The Jacksons",
      "The Smiths",
      "The Dunmeyers"],
      correctChoiceIndex: 0,
    },
    {
      text: "Which Indiana Jones movie was released back in 1984?",
      choices: ["Indiana Jones and the Kingdom of the Crystal Skull",
         "Raiders of the Lost Ark",
         "Indiana Jones and the Temple of Doom",
         "Indiana Jones and the Last Crusade"],
      correctChoiceIndex: 2,
    },
    {
      text: "Which iconic TV featured the main characters, Samantha, Carrie, Cynthia and Charlotte?",
      choices: ["Sex and the City", "The Walking Dead", "Grey's Anatomy", "Supernatural"],
      correctChoiceIndex: 0,
    },
    {
      text: "How many Lord of the Rings films are there?",
      choices: ["4", "2", "3", "5"],
      correctChoiceIndex: 2,
    },
    {
      text: "Which cartoon character lives in a pineapple under the sea?",
      choices: ["Jimmy Neutron", "Squidward", "Danny Phantom", "Spongebob Squarepants"],
      correctChoiceIndex: 3,
    },
    {
      text: "What was the name of the actor who played Jack Dawson in Titanic?",
      choices: ["Leonardo DiCaprio", "Tom Hanks", "Brad Pitt", "Tom Cruise"],
      correctChoiceIndex: 0,
    },
    {
      text: "In what year was the first episode of South Park aired?",
      choices: ["1995", "1997", "1999", "2002"],
      correctChoiceIndex: 1,
    },
  ];


  var quiz = {
    moviescore: 0,
    questions: [],
    currentQuestionIndex: 0,

    currentQuestion: function() {
      return this.questions[this.currentQuestionIndex]
    },

    answerFeedbackHeader: function(isCorrect) {
      return isCorrect ? "<h6 class='user-was-correct'>Correct!</h6>" :
        "<h1 class='user-was-incorrect'>Wrong!</>";
    },

    answerFeedbackText: function(isCorrect) {
      var praises = [
        "Wow. You got it right. I bet you feel really good about yourself now",
        "Correct. Which would be impressive, if it wasn't just luck"
      ];

      var encouragements = [
        "Sorry, you didn't get that right. Try to read more.",
        "Better luck next time. Sure, you can get it if you try to be mindful.",
      ];

      var choices = isCorrect ? praises : encouragements;
      return choices[Math.floor(Math.random() * choices.length)];
    },

    seeNextText: function() {
      return this.currentQuestionIndex <
      this.questions.length - 1 ? "Next" : "How did I do?";
    },

    questionCountText: function() {
      return (this.currentQuestionIndex + 1) + "/" +
        this.questions.length + ": ";
    },

    finalFeedbackText: function() {
      var user = auth.currentUser;
      var moviescore = this.moviescore;
      user.providerData.forEach(function (profile) {
                                db.collection("users").doc(profile.displayName).update({moviescore})
        });
      var level = ""
      if (this.moviescore < 5) {
        level = "BEGINNER";
      } else if (this.moviescore < 8) {
        level = "INTERMEDIATE";
      } else {
        level = "ADVANCED";
      }
      return "You got " + this.moviescore + " out of " +
        this.questions.length + " questions right." + "\n" + "Level " + level;
    },

    scoreUserAnswer: function(answer) {
      var correctChoice = this.currentQuestion().choices[this.currentQuestion().correctChoiceIndex];
      if (answer === correctChoice) {
        // this increments a number
        // Check README for a quick exercise
        this.moviescore ++;
      }
      return answer === correctChoice;
    }
  }

  // create a new instance of quiz via Object.create
  function newQuiz() {
    var quizO = Object.create(quiz);
    quizO.questions = questionsList;
    return quizO;
  }

  function makeCurrentQuestionElem(quiz) {
    var questionElem = $("#js-question-template" ).children().clone();
    var question = quiz.currentQuestion();

    questionElem.find(".js-question-count").text(quiz.questionCountText());
    questionElem.find('.js-question-text').text(question.text);

    for (var i = 0; i < question.choices.length; i++) {
      var choice = question.choices[i];
      var choiceElem = $( "#js-choice-template" ).children().clone();
      choiceElem.find("input").attr("value", choice);
      var choiceId = "js-question-" + quiz.currentQuestionIndex + "-choice-" + i;
      choiceElem.find("input").attr("id", choiceId)
      choiceElem.find("label").text(choice);
      choiceElem.find("label").attr("for", choiceId);
      questionElem.find(".js-choices").append(choiceElem);
    };

    return questionElem;
  }

  function makeAnswerFeedbackElem(isCorrect, correctAnswer, quiz) {
    var feedbackElem = $("#js-answer-feedback-template").children().clone();
    feedbackElem.find(".js-feedback-header").html(quiz.answerFeedbackHeader(isCorrect));
    feedbackElem.find(".js-feedback-text").text(quiz.answerFeedbackText(isCorrect));
    feedbackElem.find(".js-see-next").text(quiz.seeNextText());
    return feedbackElem;
  }

  function makeFinalFeedbackElem(quiz) {
    var finalFeedbackElem = $("#js-final-feedback-template").clone();
    finalFeedbackElem.find(".js-results-text").text(quiz.finalFeedbackText());
    return finalFeedbackElem;
  }

  function handleSeeNext(quiz, currentQuestionElem) {
    $("article.quiz-details").on("click", ".js-see-next", function(event) {

      if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
        $("article.quiz-details").off("click", ".js-see-next");
        quiz.currentQuestionIndex ++;
        $("article.quiz-details").html(makeCurrentQuestionElem(quiz));
      }
      else {
        $("article.quiz-details").html(makeFinalFeedbackElem(quiz))
      }
    });
  }

  function handleAnswers(quiz) {
    $("article.quiz-details").on("submit", "form[name='current-question']", function(event) {
      event.preventDefault();
      var answer = $("input[name='user-answer']:checked").val();
      quiz.scoreUserAnswer(answer);
      var question = quiz.currentQuestion();
      var correctAnswer = question.choices[question.correctChoiceIndex]
      var isCorrect = answer === correctAnswer;
      handleSeeNext(quiz);
      $("article.quiz-details").html(makeAnswerFeedbackElem(isCorrect, correctAnswer, quiz));
    });
  }

  // We can only use handleAnswers and handleRestarts when the quiz object has been created.
  // The submit event listener will create the quiz object then call other listeners.
  // On browser refresh, that object isn't saved and that's fine. If you want to remember states and objects, use localStorage
  // But we don't need that now.
  function handleStartQuiz() {
    $("article.quiz-details").html($("#js-start-template").clone());
    $("form[name='quiz-start']").submit(function(event) {
      var quiz = newQuiz();
      event.preventDefault();
      $("article.quiz-details").html(makeCurrentQuestionElem(quiz));
      handleAnswers(quiz);
      handleRestarts();
    });
  }

  // The .off() method removes event handlers that were attached with .on()
  // In this case, the listeners are handleAnswers(), handleSeeNext() and even handleRestarts()
  // handleStartQuiz will be called again to create the new quiz object and call functions with listeners
  // See how we called this once on load.
  function handleRestarts() {
    $("article.quiz-details").on("click", ".js-restart-quiz", function(event){
      event.preventDefault();
      $("article.quiz-details").off();
      handleStartQuiz();
    });
  }

  handleStartQuiz();
});
