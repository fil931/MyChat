Template.roomSubmit.onCreated(function() {
  Session.set('roomSubmitErrors', {});
});

Template.roomSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('roomSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('roomSubmitErrors')[field] ? 'has-error' : '';
  },
  //Choice of friends to add to this room
  choices: function() {
    //Returs all users except yourself
    return Meteor.users.find({
      _id: { $ne: Meteor.user()._id }
    })
  }
});

Template.roomSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var name = jQuery(e.target).find('[name=name]').val();
    var topic = jQuery(e.target).find('[name=topic]').val();

    var usersIds = [];
    jQuery(e.target).find('[name=usersIds]:checked').each(function(){
      usersIds.push(jQuery(this).val());
    });

    usersIds.push(Meteor.user()._id);

    var room = {
      name: name,
      topic: topic,
      usersIds: usersIds
    };

    var errors = validateRoom(room);
    if (errors.name || errors.topic || errors.usersId)
      return Session.set('roomSubmitErrors', errors);

    Meteor.call('roomInsert', room, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      Router.go('roomPage', {_id: result._id});
    });
  }
});
