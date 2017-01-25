// Set up global variables
var clock = {
  "break": 5,
  "session": 25,
  "sessionRunning": false,
  "breakRunning": false,
  "paused": false,
  "elapsedTime": 0,
  "remainingTime": 25 * 60 * 1000,
  "startTime": new Date().getTime(),
  "endTime": new Date().getTime() + (25 * 60 * 1000),
  "clockTimerId": "",
  "clockIntervalId": "",
  "increaseTime": function(breakOrSession) {
    this[breakOrSession] = this[breakOrSession] + 1;
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
  },
  "decreaseTime": function(breakOrSession) {
    this[breakOrSession] = this[breakOrSession] - 1;
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
  },
  "startSession": function(breakOrSession) {
    console.log("Starting period of " + breakOrSession);
    clock.startTime = new Date().getTime();
    clock.breakRunning = false;
    clock.sessionRunning = false;
    clock[breakOrSession + "Running"] = true;
    clock.endTime = clock.startTime + (clock[breakOrSession] * 60 * 1000);

    clock.clockIntervalId = window.setInterval(function() {
      
      clock.remainingTime = clock.endTime - new Date().getTime();
      console.log("Remaining Time calculated: " + clock.remainingTime);
      clock.updateView(breakOrSession);

      if (clock.remainingTime < 1000) {
        console.log("Clearing session interval");
        window.clearInterval(clock.clockIntervalId);
        clock.startSession((breakOrSession === "session") ? "break" : "session");
      }
    }, 1000, breakOrSession);
  },
  "pauseSession": function() {
    console.log("Pausing session!");
    clock.paused = true;
  },
  "updateView": function(breakOrSession) {
    console.log("Updating Display for " + breakOrSession);
    $("span.display-text").html(breakOrSession);
    $("span.display-remaining-time").html( parseInt(clock.remainingTime / 1000 / 60) + ":" + parseInt(clock.remainingTime / 1000 % 60));
    
    if (clock.remainingTime < 50000) {
      $(".display").toggleClass("period-ending");
    }
  },
  "reset": function() {
    console.log("Reseting Everything");
    clock.remainingTime = clock.session;
    window.clearTimeout(clock.clockTimerId);
    window.clearInterval(clock.clockIntervalId);
    clock.updateView("session");
  }
};

// Start the engines
$(document).ready(function() {

  $("button", ".settings").on("click", function() {
    var plusOrMinus = $(this).val();
    var breakOrSession = $(this).hasClass("session-time") ? "session" : "break";
    if (plusOrMinus === "minus") {
      console.log("Decreasing "+ breakOrSession + " because:", plusOrMinus, breakOrSession);
      clock.decreaseTime(breakOrSession);
    }
    else {
      console.log("INCREASING "+ breakOrSession + " because:", plusOrMinus, breakOrSession);
      clock.increaseTime(breakOrSession);
    }
  });

  $("button.reset").on("click", function() {
    clock.reset();
  });

  $(".display").on("click", function() {
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
    if (clock.paused) {
      clock.startSession(clock.sessionRunning ? "session" : "break");
    } else if (!clock.paused) {
        clock.startSession("session");
      }
    else {
      clock.pauseSession();
    }
  });
});