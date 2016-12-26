Meteor.subscribe('users');
Meteor.subscribe('posts');
Meteor.subscribe('rooms');
Meteor.subscribe('friends');

Meteor.startup(function() {
// Tracker.autorun(function() {
//    console.log('There are ' + Posts.find().count() + ' posts');
//  });
});
