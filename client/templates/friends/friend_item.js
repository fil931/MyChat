Template.friendItem.helpers({
  ownFriend: function() {
    return this.userId === Meteor.userId();
  }
});

Template.friendItem.events({
  'click .deleteFriend': function(e) {
    e.preventDefault();

    if (confirm("Do you want to block this user?")) {
      var currentFriendId = this._id;

      Meteor.call('friendDelete', currentFriendId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          Router.go('friendsList');
        }
      });
    }
  }
});
