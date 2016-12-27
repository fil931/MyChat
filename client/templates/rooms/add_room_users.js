Template.addRoomUsers.onCreated(function() {
  Session.set('addRoomUsersErrors', {});
});

Template.addRoomUsers.helpers({
  errorMessage: function(field) {
    return Session.get('addRoomUsersErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('addRoomUsersErrors')[field] ? 'has-error' : '';
  },
  //Choice of friends to add to this room
  choices: function() {
    //Returs all users except who are already on this room
    return Meteor.users.find({
      _id: { $nin: this.usersIds }
    })
  }
});

Template.addRoomUsers.events({
  'submit form.addRoomUsers': function(e) {
    e.preventDefault();

    var usersIds = [];
    jQuery(e.target).find('[name=usersIds]:checked').each(function(){
      usersIds.push(jQuery(this).val());
    });

    var roomId = jQuery(e.target).find('[name=roomId]').val();

    Meteor.call('addRoomUsers', roomId, usersIds, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        Router.go('roomPage', {_id: roomId});
      }
    });
  }
});
