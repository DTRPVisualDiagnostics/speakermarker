var video = document.getElementById('video1');

$(document).ready(function(){

  var results = [["Member", "Start Time", "End Time"]];
  var memberAStart = 0, memberBStart = 0, memberCStart = 0, memberDStart = 0, memberEStart = 0, memberFStart = 0, silenceStart = 0;
  var memberAEnd = 0, memberBEnd = 0, memberCEnd = 0, memberDEnd = 0, memberEEnd = 0, memberFEnd = 0, silenceEnd = 0;
  var down = {};
  var deleted = [];
  var timeShiftStack = [];

  var stopVideo = false;
  var endtimeoffset = 0.0;
  var useStorage = false;

  video.addEventListener("timeupdate", function() {
    if (stopVideo && video.currentTime >= endtimeoffset) {
      video.pause();
      stopVideo = false;
    }
  }, false);

  if (typeof(Storage) !== "undefined") {
    useStorage = true;
    if (localStorage.getItem("dtrpvd.speakermarker.results") !== null) {
      results = JSON.parse(localStorage.getItem("dtrpvd.speakermarker.results"));
      renderResults();
    }
    if (localStorage.getItem("dtrpvd.speakermarker.timeShiftStack") !== null) {      
      timeShiftStack = JSON.parse(localStorage.getItem("dtrpvd.speakermarker.timeShiftStack"));
      renderTimeShiftDisplay();
    }
  } else {
    window.alert("Local storage cannot be used. Please remember to download your results!");
  }

  function mergeTurn(endTime) {
    results.forEach(function(d,i) {
      if (d[2] === parseFloat(endTime)) {
        var found = false;
        for (j=1; j<i; j++) {
          if (results[i-j][0] === d[0]) {
            results[i-j][2] = results[i][2];
            results.splice(i,1);
            renderResults();
            found = true;
            break;
          }
        }
        if (!found) {
          window.alert("No older turn from " + d[0])
        }
      }
    });
  }


  function pushAndSave(ary) {
    results.push(ary)
    if (useStorage) {
      localStorage.setItem("dtrpvd.speakermarker.results", JSON.stringify(results));
    }
  }


// Keyboard shortcuts from 1 to 5 to represent the team members 
  $(document).keydown(function (e) {  
    if ($(":focus")[0] !== $("#timeShiftInput")[0]) {
      if (e.which === 49 && video.currentTime !==0) {
          $("#member_A").addClass('active');
          if (down['49'] == null) { // first press
            memberAStart = video.currentTime;
            down['49'] = true; // record that the key's down
          }
      } else if (e.which === 50 && video.currentTime !==0){
          $("#member_B").addClass('active');
          if (down['50'] == null) {
            memberBStart = video.currentTime;
            down['50'] = true;
          };
      } else if (e.which === 51 && video.currentTime !==0){
          $("#member_C").addClass('active');
          if (down['51'] == null) {
            memberCStart = video.currentTime;
            down['51'] = true;
          };
      } else if (e.which === 52 && video.currentTime !==0){
          $("#member_D").addClass('active');
          if (down['52'] == null) {
            memberDStart = video.currentTime;
            down['52'] = true;
          };
      } else if (e.which === 53 && video.currentTime !==0){
          $("#member_E").addClass('active');
          if (down['53'] == null) {
            memberEStart = video.currentTime;
            down['53'] = true;
          };
      } else if (e.which === 54 && video.currentTime !==0){
          $("#member_F").addClass('active');
          if (down['54'] == null) {
            memberFStart = video.currentTime;
            down['54'] = true;
          };
      } 
    }
    // delete last turn, jump 3 seconds before it and slow down the video speed by 0.1 when "x" is pressed
    if (e.which === 88) {
      var deletedTurn = results.pop();
      deleted.push(deletedTurn);
      newTime = deletedTurn[1] - 3;
      if (newTime < 0.0) {
        newTime = 0.0;
      }
      video.currentTime = newTime;
      renderResults();
    } 
    // "s" as shortcut for slow down video
    else if (e.which === 83) {
      slowDownVideo();
    }
    // "f" as shortcut for speed up video
    else if (e.which === 70) {
      speedUpVideo();
    }
    else if (e.which === 80) {
		  rewindVideo();
    }
    // merge last turn on pressing "m"
    else if (e.which === 77) {
      mergeTurn(results[results.length-1][2])
    }
    // "l" for fullscreen
    else if (e.which === 76) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    }
  });

// Keyboard shortcuts from 1 to 5 to represent the team members and space to represent silence
  $(document).keyup(function (e) {  
    if (e.which === 49 && video.currentTime !==0) {
        $("#member_A").removeClass('active');
        memberAEnd = video.currentTime;
        pushAndSave(["Member A", memberAStart, memberAEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } else if (e.which === 50 && video.currentTime !==0){
        $("#member_B").removeClass('active'); 
        memberBEnd = video.currentTime;
        pushAndSave(["Member B", memberBStart, memberBEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } else if (e.which === 51 && video.currentTime !==0){
        $("#member_C").removeClass('active');
        memberCEnd = video.currentTime;
        pushAndSave(["Member C", memberCStart, memberCEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } else if (e.which === 52 && video.currentTime !==0){
        $("#member_D").removeClass('active');
        memberDEnd = video.currentTime;
        pushAndSave(["Member D", memberDStart, memberDEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } else if (e.which === 53 && video.currentTime !==0){
        $("#member_E").removeClass('active');
        memberEEnd = video.currentTime;
        pushAndSave(["Member E", memberEStart, memberEEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } else if (e.which === 54 && video.currentTime !==0){
        $("#member_F").removeClass('active');
        memberFEnd = video.currentTime;
        pushAndSave(["Member F", memberFStart, memberFEnd]);
        down[e.which] = null
        resultsOnScreen();
        console.log(results);
    } 
  });

// don't trigger the timestamps when using the keyboards shortcuts
  $('#team_name_input').bind('keyup keydown', function(e) {
     e.stopPropagation(); 
  });

// don't trigger the space default functions
  $(document).keydown(function(e) {
    if (e.which == 32) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        return false;
    }
  });

// don't trigger the timestamps when click on the nextVideo button
  $('#nextVideo').bind('click', function(e) {
     e.stopPropagation(); 
  });

// don't trigger the timestamps when click on the export button
  $('#Export').bind('click', function(e) {
    e.stopPropagation();
    exportData();
  });

  // clean the results array when button is clicked
  $('#clean').bind('click', function() {
    clearResults(); 
  });

// removes row entry on the screen and array
  $('table').on('click', 'button.removebutton', function () {
    //member in the row
    // var memberRow = $(this).parent().parent()[0]["children"][0]["innerHTML"];
    //start time in the row
    // var startTimeRow = +$(this).parent().parent()[0]["children"][1]["innerHTML"];
    // end time in the row
    var index = parseInt($(this).parent().parent()[0].id);
    results.splice(index,1);
    renderResults();
    return false;
  });

  // merges this row with the one before
  $('table').on('click', 'button.mergebutton', function () {
    mergeTurn($(this).parent().parent().find(".endTimeEntry")[0].innerHTML);
  });

  $('table').on("click", "td.startTimeEntry", function() {
    video.currentTime = this.innerHTML;
    endtimeoffset = $(this).parent().find(".endTimeEntry")[0].innerHTML;
    stopVideo = true;
  });

  $("#timeShiftApplyButton").on("click", function() {
    timeShift = parseFloat($("#timeShiftInput").val());
    timeShiftStack.push(timeShift);
    applyTimeShift(timeShift);
  });

  $("#timeShiftUndoButton").on("click", function() {
    if (timeShiftStack.length > 0) {
      timeShift = -1 * timeShiftStack.pop();
      applyTimeShift(timeShift);
    }
  });

  function applyTimeShift(timeShift) {    
    results.forEach(function(d,i) {
      if (i > 0) {
        d[1] = "" + (parseFloat(d[1]) + timeShift).toFixed(6);
        d[2] = "" + (parseFloat(d[2]) + timeShift).toFixed(6);
      }
    });
    renderTimeShiftDisplay();
    if (useStorage) {
      localStorage.setItem("dtrpvd.speakermarker.timeShiftStack", JSON.stringify(timeShiftStack));
    }
    renderResults();
  }

  function renderTimeShiftDisplay() {    
    if (timeShiftStack.length > 1) {
      $("#timeShiftDisplay").html(timeShiftStack.reduce(function(previousValue, currentValue, currentIndex, array) { return previousValue + currentValue; }).toFixed(5));
    }
    else if (timeShiftStack.length === 1) {
      $("#timeShiftDisplay").html(timeShiftStack[0].toFixed(5));
    }
    else {
      $("#timeShiftDisplay").html(0.0);
    }
  }


// function that exports array results to excel .xlsx
  function exportData() {
      var team = $("#team_name_input").val();

      alasql("SELECT * INTO XLSX(\'"+ team + ".xlsx\',{headers:true}) FROM ? ",[results]);
  }

// clear the results array
  function clearResults(){
    results = [["Member", "Start Time", "End Time"]];
    // clean the results on the page, but keeps the first row
    $('tr').not(':first').remove();
    console.log(results);
    if (useStorage) {
      localStorage.setItem("dtrpvd.speakermarker.results", JSON.stringify(results));
      localStorage.removeItem("dtrpvd.speakermarker.timeShiftStack")
      timeShiftStack = []
      renderTimeShiftDisplay()
    }
  };

// displays time stamps in the HTML page
  function resultsOnScreen(){
          var lastResult = results.length - 1;
          appendTurn(lastResult);
          // $("table").append("<tr id =\"row"+lastResult + "\"><td>" + results[lastResult][0] + "</td><td>" + results[lastResult][1] + "</td><td>" + results[lastResult][2] + "</td><td class=\"delete\"><button class=\"removebutton\"><img src=\"delete.png\" height=10px width=10px ></td></tr>");
  }

  function renderResults(){
    $('tr').not(':first').remove();
    for (var i = 1; i < results.length; i++) {
      appendTurn(i);
    }
    if (useStorage) {
      localStorage.setItem("dtrpvd.speakermarker.results", JSON.stringify(results));
    }
  }

  function appendTurn(index) {
    $("table").append("<tr id =" + index + "><td class=\"merge\"><button class=\"mergebutton\"><img src=\"img/merge.png\" height=10px width=10px ></td><td>" + results[index][0] + "</td><td class='startTimeEntry'>" + results[index][1] + "</td><td class='endTimeEntry'>" + results[index][2] + "</td><td class=\"delete\"><button class=\"removebutton\"><img src=\"img/delete.png\" height=10px width=10px ></td></tr>");
  }

});

// Use this part of code if you are going to use the Next Video button
// PLACE ALL VIDEOS' NAMES HERE
// var videoList = ['big_buck_bunny.mp4','test.mp4','test2.mp4','ChocolateScene.mp4'];
// var index = videoList.indexOf(window.currentVideoName);

// //Next video button
// function nextButton(){
//   index = index + 1;

//   if (index === videoList.length){
//     index = 0;
//     video.src = videoList[index];
//   } else {
//     video.src = videoList[index];
//     window.currentVideoName = videoList[index];
//   }
// }

var mp4Vid = document.getElementById('mp4Source');
// Load the video you select from your hard disk
var x;
  
$("#loadVideo").click(function(){
  x = $(":file").val();
  x = x.replace(/.*(\/|\\)/, '');
  console.log(x);

  console.log(mp4Vid);
  $(mp4Vid).attr('src', x);
  video.load();
});

$(":file").change(function(){
  var newSource = $(":file").val();
  console.log($(":file").val());
});

//slow down video button
$("#slowDownVid").click(slowDownVideo());

//speed up video button
$("#speedUpVid").click(speedUpVideo());
    
//rewind video button
$("#rewind").click(rewindVideo());

var node = document.querySelector('#message');
var inputNode = document.querySelector('#videoSource');



function slowDownVideo(){
  if (!(video.playbackRate - 0.1 < 0.5)) {
    video.playbackRate -= 0.1;
    $("#videoSpeed").html(""+video.playbackRate.toFixed(1));
  }
}

function rewindVideo(){
	video.currentTime = video.currentTime - 4;
}

function speedUpVideo(){  
  if (!(video.playbackRate + 0.1 >= 2.1)) {
    video.playbackRate += 0.1;
    $("#videoSpeed").html(""+video.playbackRate.toFixed(1));
  }
}

(function localFileVideoPlayerInit(win) {
    var URL = win.URL || win.webkitURL;
    
    var displayMessage = (function displayMessageInit() {
            

            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }());

    var playSelectedFile = function playSelectedFileInit(event) {
            var file = this.files[0];
            var type = file.type;
            var videoNode = document.querySelector('#video1');
            var canPlay = videoNode.canPlayType(type);

            canPlay = (canPlay === '' ? 'no' : canPlay);

            var message = 'Can play type "' + type + '": ' + canPlay;
            var isError = canPlay === 'no';

            displayMessage(message, isError);

            if (isError) {
                return;
            }

            var fileURL = URL.createObjectURL(file);

            videoNode.src = fileURL;
        };

    

    if (!URL) {
        displayMessage('Your browser is not ' + '<a href="http://caniuse.com/bloburls">supported</a>!', true);
        return;
    }

    inputNode.addEventListener('change', playSelectedFile, false);
}(window));