Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.publish('rooms', function() {
  return Rooms.find();
});

Meteor.publish('friends', function() {
  return Friends.find();
});
