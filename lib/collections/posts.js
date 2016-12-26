Posts = new Mongo.Collection('posts');

validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "Un titre d'article doit être renseigné";
  return errors;
}

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  },
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
      var errors = validatePost(modifier.$set);
      return errors;
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title)
      throw new Meteor.Error('invalid-post', "You must set a title for your post");

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      modified: new Date()
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },

  postEdit: function(currentPostId, postProperties) {
    check(this.userId, String);
    check(currentPostId, String);
    check(postProperties, {
      title: String
    });

    postProperties.modified = new Date();

    Posts.update(currentPostId, {$set: postProperties});
  },

  postDelete: function(currentPostId) {
    check(currentPostId, String);
    Posts.remove(currentPostId);
  }
});
