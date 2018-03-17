// YOUR CODE HERE:
var app = {
  serverURL: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: function() {
    // app.users = {}
    // app.rooms = {}
    $(document).ready(function() {
      $('.username').on('click', app.handleUsernameClick);
      $('#send .submit').on('submit', this, app.handleSubmit);
      $('#roomSelect').on('change', app.roomFilter);
    });
  },
  roomFilter: function() {
    var room = $('#roomSelect :selected').text();
    console.log(room);
    // var dataReq = {'roomname': room};
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.serverURL,
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
      url: app.serverURL,
      type: 'GET',
      //data: JSON.stringify(message),
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
  clearMessages: function() {
    $('#chats').empty();
  },
  renderMessage: function(message) {
    $('#chats').prepend(`<div><div class="fullHandle"><span class="username">${message.username}</span>:</div><div>${message.text}</div></div>`);
    $('.username').off();
    $('.username').on('click', this, app.handleUsernameClick);
  },
  renderRoom: function(roomName) {
    $('#roomSelect').prepend(`<option value="${roomName}">${roomName}</option>`);
  },
  handleUsernameClick: function() {
    console.log(this.innerText);
  },
  handleSubmit: function() {
    console.log('pass test');
  }
};
  

