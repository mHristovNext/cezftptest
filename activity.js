define(['postmonger'], function(Postmonger) {
    'use strict';
    
});

var connection = new Postmonger.Session();

connection.trigger('ready');

connection.on("initActivity", initialize);

connection.on("clickedNext", onClickedNext);


function initialize(data) {
    if (data) {
      payload = data;
    }

    var message;
    var hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
        if (key === "message") {
          message = val;
        }
      });
    });

    // If there is no message selected, disable the next button
    if (!message) {
      showStep(null, 1);
      connection.trigger("updateButton", { button: "next", enabled: false });
      // If there is a message, skip to the summary step
    } else {
      $("#select1")
        .find("option[value=" + message + "]")
        .attr("selected", "selected");
      $("#message").html(message);
      showStep(null, 3);
    }
  }

  function onClickedNext() {
    if (
      (currentStep.key === "step3" && steps[3].active === false) ||
      currentStep.key === "step4"
    ) {
      save();
    } else {
      connection.trigger("nextStep");
    }
  }