Template.roomsList.helpers({
  rooms: function() {
    return Rooms.find({
      usersIds: Meteor.user()._id
    });
  }
});
