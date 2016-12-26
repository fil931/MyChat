Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      title: jQuery(e.target).find('[name=title]').val()
    }

    var errors = validatePost(postProperties);
    if (errors.title)
      return Session.set('postEditErrors', errors);

    Meteor.call('postEdit', currentPostId, postProperties, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },

  'click .deletePost': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;

      Meteor.call('postDelete', currentPostId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          Router.go('postsList');
        }
      });
    }
  }
});
