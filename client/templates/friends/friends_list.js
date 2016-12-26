Template.friendsList.helpers({
  friends: function() {
    var friends = Friends.find({
      userId : Meteor.user()._id
    });
    var friendsIds = friends.map(function(f) { return f.friendId });

    return Meteor.users.find({
      _id: {$in: friendsIds}
    });
  }
});
