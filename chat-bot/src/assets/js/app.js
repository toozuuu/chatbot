// IIFE - Immediately Invoked Function Expression
(function ($, window, document) {
  "use strict";

  /* Global Init */

  function init() {
    $("#emojionearea1").keypress(function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
        $('#send-button').click();
        console.log("LOG ...!")
      }
    });
  }

  // Listen for the jQuery ready event on the document
  $(function () {
    init();
  });

}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter

function setText(json, payload) {
  //  alert(payload);
  //json["text"] = payload
  //  $("#emojionearea1").val(payload);
  console.log(json)
  //  $('#send-button').click();
  var raw = document.createElement('div');
  raw.className = 'raw'
  $('#message-thread').append(raw);
  $session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : '0001'
  $request_json = {
    "tenant_id": "1234",/* tenant id*/
    "session_id": $session_id,/* session id // else '0000'*/
    "training": "false",
    "text": payload/* user input text */
  }
  // console.log($session_id);
  sendResquest($request_json)
}

function setButtons(json, button_x, setEntity) {
  buttons_x = '/request_item{"'+ button_x +'": "'+ setEntity +'"}'
  // setEntity= "edss";
  //   alert(buttons_x);
  //json["text"] = payload
  //  $("#emojionearea1").val(payload);
  console.log(json)
  //  $('#send-button').click();
  var raw = document.createElement('div');
  raw.className = 'raw'
  $('#message-thread').append(raw);
  $session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : '0001'
  $request_json = {
    "tenant_id": "1234",/* tenant id*/
    "session_id": $session_id,/* session id // else '0000'*/
    "training": "false",
    "text": buttons_x/* user input text */
  }
  // console.log($session_id);
  sendResquest($request_json)
}

// content toggle 
function toggleClass() {
  var element = document.getElementById("message-toggle");
  element.classList.toggle("remove");

  var element = document.getElementById("shoping-cart-toggle");
  element.classList.toggle("remove");
}

// content toggle 
function toggleBadge() {
  var element = document.getElementById("amount-content");
  element.classList.toggle("remove");

  var element = document.getElementById("amount-badges");
  element.classList.toggle("remove");
}

// counter
jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
jQuery('.quantity').each(function () {
  var spinner = jQuery(this),
    input = spinner.find('input[type="number"]'),
    btnUp = spinner.find('.quantity-up'),
    btnDown = spinner.find('.quantity-down'),
    min = input.attr('min'),
    max = input.attr('max');

  btnUp.click(function () {
    var oldValue = parseFloat(input.val());
    if (oldValue >= max) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue + 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });

  btnDown.click(function () {
    var oldValue = parseFloat(input.val());
    if (oldValue <= min) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue - 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });
});

//CHAT BOT SEND BUTTON IMPLEMENTATION
$('#send-button').click(function () {
  $session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : '0001'
  $request_json = {
    "tenant_id": "1234",/* tenant id*/
    "session_id": $session_id,/* session id // else '0000'*/
    "training": "false",
    "text": $('#emojionearea1').val()/* user input text */
  }
  sendResquest($request_json)
});

$('#clear-button').click(function(){
  alert("Clear");
  $payload = '/restart'
  $session_id = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : '0001'
  $request_json = {
    "tenant_id": "1234",/* tenant id*/
    "session_id": $session_id,/* session id // else '0000'*/
    "training": "false",
    "text": $payload/* user input text */
  }
  sendClear($request_json)
});

function sendClear(request_json){
  $.post("http://localhost:8080/chatbot/getvalues/",
    $request_json)
    .done(function(){
      console.log("Cleaned");
    })
    .fail(function(){
      console.log("Failed");
    });
}

function sendResquest($request_json) {

  // alert("enter pressed")
  $('#chat-indicator').css('display', 'block'); /* display typing indicator */
  var child = document.createElement('div'); /* create new div element to append the to the chat thread */
  child.innerHTML = '<div class="col-md-12">' +
    '<div class="right-side-msg animated fadeIn"><p>' +
    $('#emojionearea1').val()
    + '</p></div></div>'; /* update created   div inner html with user input text */
  child.className = 'row'/* add boostrap class 'row' */
  $('#message-thread').append(child);/* append user input to the chat thread */
  $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);/* set the div overflow focus to the bottom */
  // console.log($session_id)
  $.post("http://localhost:8080/chatbot/getvalues/",
    $request_json)
    .done(function (data) {/* on success method  */
      console.log(data);

      if (data.text != "") {
        data.text.forEach(txt => {
          $('#chat-indicator').css('display', 'none');/* hide chat bot typing indicator */
          var child = document.createElement('div');
          child.innerHTML = '<div class="col-md-12">' +
            '<div class="left-side-msg animated fadeIn"><p>' +
            txt /* append with chat bot response answer text */
            + '</p></div></div>';
          child.className = 'row'
          $('#message-thread').append(child);
          $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
        });
      }
      if (data.buttons != null && $.isArray(data.buttons)) {
        if (data.buttons.length > 0){
          var child = document.createElement('div.container');
          $payload_male = data.buttons[0].payload;
          $payload_female = data.buttons[1].payload;

          data.buttons.forEach(button => {

            console.log(button.title)
            console.log(button.payload)
            if (button.title == "Men") {
              child.innerHTML += '<input type="button" class="btn btn-info" value="' + button.title + '" onclick="setText($request_json, $payload_male)"  id= "Male"></input>'
            }
            else {
              child.innerHTML += '<input type="button" class="btn btn-info" value="' + button.title + '" onclick="setText($request_json, $payload_female)"  id= "Male"></input>'
            }
          });
          $('#message-thread').append(child);
          $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
        }
        
      }
      if (data.details.length > 0 || data.details != null) {
        var buttonchild = document.createElement('div.container');
        data.details.forEach(detail => {
          // buttonchild.innerHTML += '<input type="button" class="btn btn-info" value="' + detail + '"' +
          // 'onclick="setButtons($request_json, \"'+detail+'\", \"'+detail+'\")"></input>'
          buttonchild.innerHTML += '<input type="button" class="btn btn-info" value="' + detail + '"onclick="setButtons($request_json, \'' + data.require[0] + '\', \'' + detail + '\')"></input>'
		  //buttonchild.innerHTML += '<input type="button" class="btn btn-info" value="' + detail + '"onclick="setButtons($request_json,  buttons_x , setEntity )"></input>'
        });
        $('#message-thread').append(buttonchild);
        $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
      }

      if (data.image.length > 0) {
        var htm = '';
        $('#chat-indicator').css('display', 'none');/* hide chat bot typing indicator */
        var child = document.createElement('div');
        htm += '<div class="col-lg-12"><div class="center-msg animated fadeIn"><div class="card-section">'

        data.image.forEach(element => {
          htm = htm + '<div class="product-card"><div class="orderClick"><img src="' + element + '" /><div class="content-section">Name</div></div></div>';
        });

        htm += '</div></div></div>'
        child.innerHTML = htm;
        child.className = 'row'
        $('#message-thread').append(child);
        $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
      }
      $("#emojionearea1").val('').change();


      if (data.image.length == 0 && data.buttons == null && data.details.length == 0 && data.text.length == 0) {
        $('#chat-indicator').css('display', 'none');/* hide chat bot typing indicator */
        var child = document.createElement('div');
        child.innerHTML = '<div class="col-md-12">' +
          '<div class="left-side-msg animated fadeIn"><p>' +
          "We are Sorry. Something went Wrong. Please try again." /* append with chat bot response answer text */
          + '</p></div></div>';
        child.className = 'row'
        $('#message-thread').append(child);
        $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
      }
      else if (data.buttons != null) {
        if ($.isArray(data.buttons)) {
          if (data.buttons.length == 0) {
            $('#chat-indicator').css('display', 'none');/* hide chat bot typing indicator */
            var child = document.createElement('div');
            child.innerHTML = '<div class="col-md-12">' +
              '<div class="left-side-msg animated fadeIn"><p>' +
              "We are Sorry. Something went Wrong. Please try again." /* append with chat bot response answer text */
              + '</p></div></div>';
            child.className = 'row'
            $('#message-thread').append(child);
            $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
          }
        }
      }
    })

    .fail(function () {/* on fail method */
      alert("error");
      $('#chat-indicator').css('display', 'none');
      $('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
      $("#emojionearea1").val('').change();
    });
}




