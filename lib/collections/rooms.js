Rooms = new Mongo.Collection('rooms');

validateRoom = function (room) {
  var errors = {};
  if (!room.name)
    errors.title = "Un nom doit être renseigné";

  if (!room.topic)
    errors.title = "Un sujet doit être renseigné";

  return errors;
}

Rooms.allow({
  update: function(userId, room) {
    return ownsDocument(userId, room);
  },
  remove: function(userId, room) {
    return ownsDocument(userId, room);
  },
});

Rooms.deny({
  update: function(userId, room, fieldNames, modifier) {
      var errors = validateRoom(modifier.$set);
      return errors;
  }
});

Meteor.methods({
  roomInsert: function(roomAttributes) {
    check(this.userId, String);
    check(roomAttributes, {
      name: String,
      topic: String,
      usersIds: Array
    });

    var errors = validateRoom(roomAttributes);
    //Empty field case
    if (errors.name)
      throw new Meteor.Error('invalid-room', "You must set a name for your room");
    if (errors.topic)
      throw new Meteor.Error('invalid-room', "You must set a topic for your room");

    var room = _.extend(roomAttributes, {
      userId: Meteor.user()._id,
      createdAt: new Date()
    });

    var roomId = Rooms.insert(room);

    return {
      _id: roomId
    };
  },

  userRoomDelete: function(roomId, userId) {
    check(roomId, String);
    check(userId, String);
    var room = Rooms.findOne({
      '_id': roomId
    });

    var usersIds = room.usersIds;

    if (usersIds.includes(userId)) {
      var index = usersIds.indexOf(userId);
      usersIds.splice(index, 1);

      Rooms.update(roomId, {$set:{ "usersIds": usersIds }});
    }
  },

  roomDelete: function(roomId) {
    check(roomId, String);
    Rooms.remove({
      '_id': roomId
    });
  },

  addRoomUsers: function(roomId, newUsersIds) {
    check(roomId, String);
    check(newUsersIds, Array);

    var room = Rooms.findOne({
      '_id': roomId
    });

    var roomUsersIds = room.usersIds;
    var usersIds = roomUsersIds.concat(newUsersIds);

    Rooms.update(roomId, {$set:{ "usersIds": usersIds }});
  }
});
