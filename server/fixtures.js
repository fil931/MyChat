if (Posts.find().count() === 0) {
  Posts.insert({
    title: 'Introducing Telescope',
    author: 'Fil'
  });

  Posts.insert({
    title: 'Meteor',
    author: 'Fil'
  });
  
  Posts.insert({
    title: 'The Meteor Boooook',
    author: 'Fil'
  });
}
