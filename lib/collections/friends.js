Friends = new Mongo.Collection('friends');

validateFriend = function (friend) {
  var errors = {};
  if (!friend.friendId)
    errors.friendId = "Sélectionner un utilisateur parmi ceux de la liste";

  if (isFriend(friend.friendId)) {
    errors.friendId = "Cet utilsateur est déjà votre ami";
  }

  return errors;
}

Friends.allow({
  update: function(userId, friend) {
    return ownsDocument(userId, friend);
  },
  remove: function(userId, friend) {
    return ownsDocument(userId, friend);
  },
});

Friends.deny({
  update: function(userId, friend, fieldNames, modifier) {
      var errors = validateFriend(modifier.$set);
      return errors;
  }
});

Meteor.methods({
  friendInsert: function(friendAttributes) {
    check(this.userId, String);
    check(friendAttributes, {
      friendId: String
    });

    var errors = validateFriend(friendAttributes);
    //Empty field case
    if (errors.friendId)
      throw new Meteor.Error('invalid-post', "You must set an id for your friend");

    //Duplicate friend
    if (isFriend(friendAttributes.friendId)) {
      throw new Meteor.Error('invalid-post', "This user is already your friend!");
    }

    var user = Meteor.user();
    var friend = _.extend(friendAttributes, {
      userId: user._id,
      added: new Date()
    });

    var friendId = Friends.insert(friend);

    return {
      _id: friendId
    };
  },

  friendDelete: function(currentFriendId) {
    check(currentFriendId, String);
    if (isFriend(currentFriendId)) {
      Friends.remove({
        'friendId': currentFriendId
      });
    }
  }
});

//Function to detect if user is already your friend
function isFriend(friendId) {
  var myFriends = Friends.find({
    userId : Meteor.user()._id
  });
  var myFriendsIds = myFriends.map(function(f) { return f.friendId });

  return myFriendsIds.includes(friendId);
}
