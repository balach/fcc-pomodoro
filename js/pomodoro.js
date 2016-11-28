// Set up global variables
var clock = {
  "break": 5,
  "session": 25,
  "runningSession": false,
  "time-elapsed": 0,
  "time-remaining": 25,
  "fillTimerId": "",
  "clockTimerId": "",
  "startSession" : function(){
    console.log("Starting session!");
  },
  "pauseSession" : function(){
    console.log("Pausing session!");
  },
  "updateView" : function(){
    console.log("Updating Display");
    $("span.remaining-time").html(clock["time-remaining"] );
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
    if (clock.runningSession && clock["time-remaining"]  < 2) {
      //TODO: start filling the pomodoro!
      clock.fillPomodoro();
    }
  },
  "fillPomodoro" : function() {
    window.setTimeOut(function() {
      var currentFill = $(".display").css("background-color");
      var newFillPercent = currentFill.split(",").pop();
      newFillPercent = parseFloat(newFillPercent.split(")")[0]);
      if (newFillPercent < 1) {
        newFillPercent = (newFillPercent * 1.1 >= 1) ? 1: newFillPercent * 1.1 ;
        var newFillValue = currentFill.push(newFillPercent + ")").join(",");
        $(".display").css("background-color", newFillValue);
      }
      if (newFillPercent < 1 && clock.runningSession) {
        clock.fillPomodoro();
      }
    }, 1000);
  },
  "reset" : function(){
    console.log("Reseting Everything");
    clock["time-remaining"] = clock.session;
    clock.updateView();
  }
};

// Start the engines
$(document).ready(function() {

  $("button").on("click", function(){
    var plusOrMinus = $(this).val();
    var isSession = $(this).hasClass("session-time");
    var isBreak = $(this).hasClass("break-time");
    if (isSession) {
      clock.session = (plusOrMinus === "-") ? clock.session-- : clock.session++;
    }
    else if (isBreak) {
      clock.break = (plusOrMinus === "-") ? clock.break-- : clock.break++;
    }
    clock.updateView();
  });
  $("button.reset").on("click", function(){
    clock.reset();
  });
  $(".display").on("click", function(){
    if (clock.runningSession) {
      clock.pauseSession();
      clock.runningSession = false;
    }
    else {
      clock.startSession();
      clock.runningSession = true;
    }
  });
});