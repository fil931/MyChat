Template.roomItem.helpers({
  roomUsers: function() {
    var roomUsers;

    if (this.usersIds.length) {
      roomUsers = Meteor.users.find({
        '_id': {
          $in: this.usersIds
        }
      });
    }

    return roomUsers;
  },
  roomChats: function() {
    return Chats.find({
      roomId: this._id
    });
  },
  isYourMsg: function(userId) {
    return userId === Meteor.userId();
  }
});

Template.roomItem.events({
  'submit form.deleteUser': function(e) {
    e.preventDefault();

    if (confirm("Do you want to delete this user for this room ?")) {
      var userId = jQuery(e.target).find('[name=userId]').val();
      var roomId = this._id;

      Meteor.call('userRoomDelete', roomId, userId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          Router.go('roomPage', {_id: roomId});
        }
      });
    }

  },
  'click .deleteRoom': function(e) {
    e.preventDefault();

    if (confirm("Do you want to delete this room?")) {
      var roomId = this._id;

      Meteor.call('roomDelete', roomId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          Router.go('roomsList');
        }
      });
    }
  },

  'submit form.addRoomMessage': function(e) {
    e.preventDefault();

    var chat = {
      roomId: this._id,
      message: jQuery(e.target).find('[name=message]').val()
    };

    Meteor.call('chatInsert', chat, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        Router.go('roomPage', {_id: chat.roomId});
      }
    });
  },

  'change .myFile': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    });
  }
});
