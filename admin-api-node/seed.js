const mongoose = require("mongoose");
const config = require("config");
const { User } = require("./models/user");
const { Task } = require("./models/task");
const bcrypt = require('bcrypt')

const tasks = [
  { title: "Design", description: 'design the application', status: 'New', comment: 'Design Task' },
  { title: "Development", description: 'dev the application', status: 'New', comment: 'Development Task' },
  { title: "Test", description: 'test the application', status: 'New', comment: 'Test Task' },
  { title: "Deploy", description: 'deploy the application', status: 'New', comment: 'Deploy Task' }
];

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

  await Task.deleteMany({});
  await User.deleteMany({});
  await Task.insertMany(tasks);
  await User.create(user);

  mongoose.disconnect();

  console.info("Task Created! Done!");
}

seed();
