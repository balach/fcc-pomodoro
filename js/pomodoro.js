// Set up global variables
var clock = {
  "break": 1,
  "session": 2,
  "runningSession": false,
  "elapsedTime": 0,
  "remainingTime": 3 * 60 * 1000,
  "startTime": new Date().getTime(),
  "endTime": new Date().getTime() + (3 * 60 * 1000),
  "fillTimerId": "",
  "fillpercent": 100,
  "clockTimerId": "",
  "clockIntervalId": "",
  "startSession": function() {
    console.log("Starting session!");
    clock.startTime = new Date().getTime();
    clock.endTime = clock.startTime + (clock.session * 60 * 1000);
    clock.runningSession = true;
    $(".display").css("background", "linear-gradient(rgba(205, 220, 57, 0.9) 100%, rgba(255, 87, 34, 0.9) 100%, rgba(255, 87, 34, 0.9))");
    clock.clockIntervalId = window.setInterval(function() {

      clock.remainingTime = clock.endTime - new Date().getTime();
      clock.updateView();


      if (clock.remainingTime <= 1000) {
        console.log("Clearing session interval");
        window.clearInterval(clock.clockIntervalId);
      }
    }, 1000);
  },
  "pauseSession": function() {
    console.log("Pausing session!");
  },
  "updateView": function() {
    console.log("Updating Display");
    $("span.remaining-time").html(clock.remainingTime / (60 * 1000));
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
    if (clock.runningSession && clock.remainingTime < 100000) {
      //TODO: start filling the pomodoro!
      clock.fillPomodoro();
    }
  },
  "fillPomodoro": function() {
    clock.fillTimerId = window.setTimeout(function() {
      var newFillPercent = clock.fillpercent--;
      var backgroundFill = "linear-gradient(rgba(205, 220, 57, 0.9) " + newFillPercent + "%, rgba(255, 87, 34, 0.9) " + newFillPercent + "%, rgba(255, 87, 34, 0.9))";

      if (newFillPercent > 1 && clock.runningSession) {
        $(".display").css("background", backgroundFill);
      }
      if (newFillPercent <= 1) {
        console.log("Clearing filling timeout");
        window.clearTimeout(clock.fillTimerId);
      }
    }, 1000);
  },
  "reset": function() {
    console.log("Reseting Everything");
    clock.remainingTime = clock.session;
    window.clearTimeout(clock.fillTimerId);
    window.clearTimeout(clock.clockTimerId);
    window.clearInterval(clock.clockIntervalId);
    clock.updateView();
  }
};

// Start the engines
$(document).ready(function() {

  $("button").on("click", function() {
    var plusOrMinus = $(this).val();
    var isSession = $(this).hasClass("session-time");
    var isBreak = $(this).hasClass("break-time");
    if (isSession) {
      clock.session = (plusOrMinus === "-") ? clock.session-- : clock.session++;
    } else if (isBreak) {
      clock.break = (plusOrMinus === "-") ? clock.break-- : clock.break++;
    }
    clock.updateView();
  });
  $("button.reset").on("click", function() {
    clock.reset();
  });
  $(".display").on("click", function() {
    if (clock.runningSession) {
      clock.pauseSession();
      clock.runningSession = false;
    } else {
      clock.startSession();
      clock.runningSession = true;
    }
  });
});