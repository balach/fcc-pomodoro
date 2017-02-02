// Set up global variables
var clock = {
  break: 5,
  session: 25,
  sessionRunning: false,
  breakRunning: false,
  paused: false,
  elapsedTime: 0,
  remainingTime: 25 * 60 * 1000,
  startTime: new Date().getTime(),
  endTime: new Date().getTime() + (25 * 60 * 1000),
  clockIntervalId: "",
  increaseTime: function(breakOrSession) {
    this[breakOrSession] = (this[breakOrSession] < 45) ? this[breakOrSession] + 1 : this[breakOrSession];
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
  },
  decreaseTime: function(breakOrSession) {
    this[breakOrSession] = (this[breakOrSession] > 1) ? this[breakOrSession] - 1 : this[breakOrSession];
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
  },
  startSession: function(breakOrSession, continued) {
    clock.startTime = new Date().getTime();
    clock.breakRunning = false;
    clock.sessionRunning = false;
    clock[breakOrSession + "Running"] = true;
    clock.endTime = (!!continued) ? clock.startTime + clock.remainingTime : clock.startTime + (clock[breakOrSession] * 60 * 1000);

    clock.clockIntervalId = window.setInterval(function() {
      
      clock.remainingTime = clock.endTime - new Date().getTime();
      clock.updateView(breakOrSession);

      if (clock.remainingTime < 1000) {
        window.clearInterval(clock.clockIntervalId);
        clock.startSession((breakOrSession === "session") ? "break" : "session");
      }
    }, 1000, breakOrSession);
  },
  pauseSession: function() {
    clock.paused = true;
    window.clearInterval(clock.clockIntervalId);
  },
  updateView: function(breakOrSession) {
    $("span.display-text").html(breakOrSession);
    $("span.display-remaining-time").html( parseInt(clock.remainingTime / 1000 / 60) + ":" + parseInt(clock.remainingTime / 1000 % 60));
    
    if (clock.remainingTime < 50000) {
      $(".display").toggleClass("period-ending");
    }
  },
  reset: function() {
    clock.remainingTime = clock.session;
    clock.sessionRunning = false;
    clock.breakRunning = false;
    clock.paused = false;
    clock.elapsedTime = 0;
    window.clearInterval(clock.clockIntervalId);
    $("span.display-text").html("Session");
    $("span.display-remaining-time").html(clock.session);
    $(".display").removeClass("period-ending");
  }
};

// Start the engines
$(document).ready(function() {

  $("button", ".settings").on("click", function() {
    var plusOrMinus = $(this).val();
    var breakOrSession = $(this).hasClass("session-time") ? "session" : "break";
    if (plusOrMinus === "minus") {
      clock.decreaseTime(breakOrSession);
    }
    else {
      clock.increaseTime(breakOrSession);
    }
  });

  $("button.reset").on("click", function() {
    clock.reset();
  });
  $("button.pause").on("click", function() {
    clock.pauseSession();
    $("button.pause").prop("disabled", true);
  });


  $(".display").on("click", function() {
    $("span.break-time").html(clock.break);
    $("span.session-time").html(clock.session);
    if (clock.paused) {
      clock.startSession(clock.sessionRunning ? "session" : "break", true);
      $("button.pause").prop("disabled", false);
      clock.paused = false;
    } else if (!clock.paused && !clock.sessionRunning && !clock.breakRunning) {
        clock.startSession("session");
      }
    else {
      clock.pauseSession();
    }
  });
});