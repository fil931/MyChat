Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

//Posts
Router.route('/', {name: 'postsList'});

Router.route('/post/:_id', {
  name: 'postPage',
  data: function() {
    return Posts.findOne(this.params._id);
  }
});

Router.route('/post/:_id/edit', {
  name: 'postEdit',
  data: function() {
     return Posts.findOne(this.params._id);
   }
 });

Router.route('/posts/submit', {name: 'postSubmit'});

//Friends
Router.route('/friends', {name: 'friendsList'});

Router.route('/friend/:_id', {
  name: 'friendPage',
  data: function() {
    //TODO: find a better solution to blind access to friend page
    var friends = Friends.find({
      userId : Meteor.user()._id
    });
    var friendsIds = friends.map(function(f) { return f.friendId });
    var lengthId = friendsIds[0].length;

    if (friendsIds.includes(this.params._id) && this.params._id.length == lengthId) {
      return Meteor.users.findOne({
          _id: this.params._id
      });
    }
  }
});

Router.route('/friends/submit', {name: 'friendSubmit'});

//Rooms
Router.route('/rooms', {name: 'roomsList'});

Router.route('/room/:_id', {
  name: 'roomPage',
  data: function() {
    return Rooms.findOne(this.params._id);
  }
});

Router.route('/rooms/submit', {name: 'roomSubmit'});

Router.route('/room/add_users/:_id', {
  name: 'addRoomUsers',
  data: function() {
    return Rooms.findOne(this.params._id);
  }
});


//Images
Router.route('/images', {name: 'imageList'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: ['postPage', 'friendPage']});
Router.onBeforeAction(requireLogin, {only: ['postSubmit', 'friendSubmit']});
