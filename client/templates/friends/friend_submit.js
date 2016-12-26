Template.friendSubmit.onCreated(function() {
  Session.set('friendSubmitErrors', {});
});

Template.friendSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('friendSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('friendSubmitErrors')[field] ? 'has-error' : '';
  },
  choices: function() {
    //Returs all users except yourself
    return Meteor.users.find({
      _id: { $ne: Meteor.user()._id }
    })
  }
});

Template.friendSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var friendId = jQuery(e.target).find('[name=friendId]').val();

    var friend = {
      friendId: friendId
    };

    var errors = validateFriend(friend);
    if (errors.friendId)
      return Session.set('friendSubmitErrors', errors);

    Meteor.call('friendInsert', friend, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      Router.go('friendPage', {_id: friendId});
    });
  }
});
