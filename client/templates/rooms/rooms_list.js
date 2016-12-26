Template.roomsList.helpers({
  rooms: function() {
    return Rooms.find({
      userId : Meteor.user()._id
    });
  }
});
