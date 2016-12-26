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
  }
});
