const mongoose = require("mongoose");
const config = require("config");
const { User } = require("./models/user");
const { Task } = require("./models/task");
const bcrypt = require('bcrypt')

function getTask(ownerId) {
  return [
    { title: "Design", description: 'design the application', status: 'New', comment: 'Design Task', owner:ownerId },
    { title: "Development", description: 'dev the application', status: 'New', comment: 'Development Task' , owner:ownerId},
    { title: "Test", description: 'test the application', status: 'New', comment: 'Test Task' , owner:ownerId},
    { title: "Deploy", description: 'deploy the application', status: 'New', comment: 'Deploy Task' , owner:ownerId}
  ];
}


let users =
  { name: "AdminUser", email: 'admin@mail.com', password: 'test@123' ,isAdmin:true};

const getUsers = async () => {

  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(users.password, salt);
  return users;
}


async function seed() {

  await mongoose.connect(config.get("db"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  const user = await getUsers();
  await User.deleteMany({});
  const adminUser =await User.create(users);

  await Task.deleteMany({});
  await Task.insertMany(getTask(adminUser._id));
  
  mongoose.disconnect();

  console.info("Task Created! Done!");
}

seed();
