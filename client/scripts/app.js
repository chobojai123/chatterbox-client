// YOUR CODE HERE:
// $(document).ready(function() {
//   $('.username').on('click', this, app.handleUsernameClick);
//   $('#send .submit').on('click', app.handleSubmit);
//   $('#roomSelect').on('change', app.roomFilter);
//   app.init();
//   // setInterval(function() {
//   //   var room = $('#roomSelect :selected').text();
//   //   app.fetch(room);
//   // }, 60000); 
// });

var app = {
  friends: [],
  rooms: [],
  currentRoom: undefined,
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: function() {
    $('#send').submit(app.test);
    // app.friends = [];
    // app.rooms = [];
    // app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
  },
  roomFilter: function() {
    console.log('in roomFilter');
    var roomFiltered = $('#roomSelect :selected').text();
    app.currentRoom = roomFiltered;
    app.fetch();
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        //console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
        // if message has a room not in app.room, renderRoom (after html escaping)
        // only display messages for that room
        // renderMessage
        app.rooms = [];
        var roomsRendered = {}
        // if user has just loaded page and hasn't chosen a room, choose room with most messages
        if(app.currentRoom === undefined) {
          var mostPopular = {};
          for(var i = 0; i < data.length; i ++){
            if (!app.rooms.includes(data[i].roomname)) {
              app.rooms.push(data[i].roomname);
            }
            mostPopular[data[i].roomname] = (mostPopular[data[i].roomname] || 0) + 1;
          }
          var popularRoom = undefined;
          var popularRoomVal = 0;
          for (var key in mostPopular) {
            if (!popularRoom || mostPopular[key] > popularRoomVal) {
              popularRoom = key;
              popularRoomVal = mostPopular[key];
            }
          }
          app.currentRoom = popularRoom;
        }
        $('#roomSelect').empty();
        // render rooms from all fetched messages
        for (var i = 0; i < app.rooms.length; i++) {
          if (!(app.rooms[i] in roomsRendered)) {
            app.renderRoom(app.rooms[i]);
            roomsRendered[app.rooms[i]] = true;
          }
        }
        // render all messages for the chosen (or assigned) room
        for (var i = 0 ; i < data.length; i++) {
          if (data[i].roomname === app.currentRoom) {
            app.renderMessage(data[i]);
          }
        }
      },

      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        //console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  renderMessage: function(message) {
    //html escape message here
    //if there is friends, bold message
    //maybe contain function? *need to check
    var messageUserName = app.escapeAttack(message.username);
    var messageText = app.escapeAttack(message.text);  
    if (app.friends.includes(message.username)) {
      var messageText = `<strong>${messageText}</strong>`;
    }
    $('#chats').prepend(`<div><div class="fullHandle"><span class="username">${messageUserName}</span>:</div><div>${messageText}</div></div>`);
    $('.username').off();
    $('.username').on('click', this, app.handleUsernameClick);
  },
  renderRoom: function(roomName) {
    var roomName = app.escapeAttack(roomName);
    $('#roomSelect').prepend(`<option value="${roomName}">${roomName}</option>`);
  },
  handleUsernameClick: function() {
    var clickedName = this.innerText;
    console.log(clickedName);
    if (!app.friends.includes(clickedName)) {
      app.friends.push(clickedName);
    }
    app.fetch();
  },

  handleSubmit: function() {
    console.log('in handle Submit');
    var messageText = $('#message').val();
    var roomName = app.currentRoom;
    // get username
    // send ajax post request
    // clear text
    // $('#message').val('');
  },

  escapeAttack: function(string){
    // how do we only escape malicious code?
    var htmlEntity = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    }
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return htmlEntity[s];
    });
  },
  test: function() {
    console.log('in the test function');
  }

};



$(document).ready(function() {
  $('.username').on('click', this, app.handleUsernameClick);
  console.log('works');
  app.init();
  $('#roomSelect').on('change', app.roomFilter);
});
