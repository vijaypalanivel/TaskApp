const { Task, validate } = require("../models/task");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
   
  const option = req.user.isAdmin ? {}:{owner:req.user._id}
  const tasks = await Task.find(option)
    .sort("title");
  res.send(tasks);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const taks = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    comment: req.body.comment,
  });
  await taks.save();

  res.send(taks);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      comment: req.body.comment,
      owner : req.body.owner
    },
    { new: true }
  );

  if (!task)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(task);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);

  if (!task)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(task);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const task = await Task.findById(req.params.id).select("-__v");

  if (!task)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(task);
});

module.exports = router;
