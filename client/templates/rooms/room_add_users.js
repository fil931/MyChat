Template.roomAddUsers.onCreated(function() {
  Session.set('roomAddUsersErrors', {});
});

Template.roomAddUsers.helpers({
  errorMessage: function(field) {
    return Session.get('roomAddUsersErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('roomAddUsersErrors')[field] ? 'has-error' : '';
  },
  //Choice of friends to add to this room
  choices: function() {
    //Returs all users except yourself
    return Meteor.users.find({
      _id: { $ne: Meteor.user()._id }
    })
  }
});
