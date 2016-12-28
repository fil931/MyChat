Chats = new Mongo.Collection('chats');

validateChat = function (chat) {
  var errors = {};
  if (!chat.message)
    errors.message = "Un message doit être renseigné";

  return errors;
}

Chats.allow({
  update: function(userId, chat) {
    return ownsDocument(userId, chat);
  },
  remove: function(userId, chat) {
    return ownsDocument(userId, chat);
  },
});

Chats.deny({
  update: function(userId, chat, fieldNames, modifier) {
      var errors = validateChat(modifier.$set);
      return errors;
  }
});

Meteor.methods({
  chatInsert: function(chatAttributes) {
    check(chatAttributes, {
      message: String,
      roomId: String
    });

    var errors = validateChat(chatAttributes);
    //Empty field case
    if (errors.message)
      throw new Meteor.Error('invalid-room', "You must be set a message");

    var chat = _.extend(chatAttributes, {
      user: Meteor.user(),
      createdAt: new Date()
    });

    Chats.insert(chat);
  }
});
