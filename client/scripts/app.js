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
    $('#send').submit(function(event) {
      event.preventDefault();
      app.handleSubmit();
    });
  },
  roomFilter: function() {
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
        // reset rooms to only those found in most recent get request
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
        // get rid of all previous room options
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
    // get message username and roomname and escape any malicious code
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
    // add roomname to room options after escaping any malicious code
    var roomName = app.escapeAttack(roomName);
    $('#roomSelect').prepend(`<option value="${roomName}">${roomName}</option>`);
  },
  handleUsernameClick: function() {
    // add clicked username to user's friends (app.friends array)
    var clickedName = this.innerText;
    if (!app.friends.includes(clickedName)) {
      app.friends.push(clickedName);
    }
    app.fetch();
  },

  handleSubmit: function() {
    var messageText = $('#message').val();
    var roomName = app.currentRoom;
    var url = window.location.search;
    var userName = url.slice(url.search('=') + 1);
    var message = {
      'username': userName,
      'text': messageText,
      'roomname': roomName
    };
    app.send(message);
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

  decode: function(string){
    // revert back to original code
    var htmlEntity = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': "/"
    }
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return htmlEntity[s];
    });
  },


};



$(document).ready(function() {
  $('.username').on('click', this, app.handleUsernameClick);
  app.init();
  $('#roomSelect').on('change', app.roomFilter);
});
