// Set up global variables
var clock = {
  "break": 5,
  "session": 25,
  "runningSession": false,
  "elapsedTime": 0,
  "remainingTime": this.session * 60 * 1000,
  "startTime": new Date().getTime(),
  "endTime": new Date().getTime() + (25 * 60 * 1000),
  "fillTimerId": "",
  "fillpercent": 100,
  "clockTimerId": "",
  "clockIntervalId": "",
  "ff": 0,
  "fillStep": 0,
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
  "startSession": function() {
    console.log("Starting session!");
    clock.startTime = new Date().getTime();
    clock.endTime = clock.startTime + (clock.session * 60 * 1000);
    clock.runningSession = true;
    $(".display").css("background", "linear-gradient(rgba(205, 220, 57, 0.9) 100%, rgba(255, 87, 34, 0.9) 100%, rgba(255, 87, 34, 0.9))");
    clock.clockIntervalId = window.setInterval(function() {

      if (clock.ff === 9) {
        clock.remainingTime -= 1000;
      }
      else {
        clock.remainingTime = clock.endTime - new Date().getTime();
        console.log("Remaining Time calculated: " + clock.remainingTime);
      }
      clock.updateView();

      if (clock.remainingTime < 1000) {
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
    $("span.display-remaining-time").html( parseInt(clock.remainingTime / 1000 / 60) + ":" + parseInt(clock.remainingTime / 1000 % 60));
    
    if (clock.remainingTime < 100000) {
      //TODO: start filling the pomodoro!
      clock.fillPomodoro(clock.runningSession);
    }
  },
  "fillPomodoro": function(unfill) {
    clock.fillTimerId = window.setTimeout(function() {
      clock.fillStep = (clock.fillStep === 0) ? clock.remainingTime / 100000 : clock.fillStep;
      
      clock.fillpercent = (!unfill) ? clock.fillpercent + clock.fillStep : clock.fillpercent - clock.fillStep;
      console.log("Filling the pomodoro at steps of: " + clock.fillStep + " -And new fillpercent: " + clock.fillpercent);
      var backgroundFill = "linear-gradient(rgba(205, 220, 57, 0.9) " + clock.fillpercent + "%, rgba(255, 87, 34, 0.9) " + clock.fillpercent + "%, rgba(255, 87, 34, 0.9))";


      if (clock.fillpercent > 0 && clock.runningSession) {
        $(".display").css("background", backgroundFill);
      }
      if (clock.fillpercent <= 0 || clock.fillpercent >= 100) {
        console.log("Clearing filling timeout");
        clock.fillStep = 0;
        clock.fillpercent = (clock.fillpercent <= 0) ? 100 : 0;
        window.clearTimeout(clock.fillTimerId);
      }
    }, 1000);
  },
  "reset": function() {
    console.log("Reseting Everything");
    clock.remainingTime = clock.session;
    clock.fillStep = 0;
    clock.fillpercent = 100;
    window.clearTimeout(clock.fillTimerId);
    window.clearTimeout(clock.clockTimerId);
    window.clearInterval(clock.clockIntervalId);
    clock.updateView();
  }
};

function fastForward() {
  clock.remainingTime = 2 * 60 * 1000;
  clock.ff = 9;
  console.log("forwarding fast");
}

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
    if (clock.runningSession) {
      clock.pauseSession();
      clock.runningSession = false;
    } else {
      clock.remainingTime = clock.session;
      clock.startSession();
      clock.runningSession = true;
    }
  });
});