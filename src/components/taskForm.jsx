import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getTask, saveTask } from "../services/taskService";
import {getUsers} from '../services/userService'


class TaskForm extends Form {
  state = {
    data: {
      title: "",
      status: "",
      description: "",
      comment: "",
      owner: ""
    },
    status: [{_id:'New', name:'New'},{_id:'Pending', name:'Pending'},
    {_id:'Done', name:'Done'},{_id:'Approved', name:'Approved'}],
    owners: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    description: Joi.string()
      .required()
      .label("Description"),
      status: Joi.string()
      .required()
      .label("Status"),
      comment: Joi.string()
      .required()
      .label("Comment"),
      owner: Joi.string()
      .required()
      .label("Owner")
    
  };


  async populateTask() {
    try {
      const taskId = this.props.match.params.id;
      if (taskId === "new") return;

      const { data: task } = await getTask(taskId);
      this.setState({ data: this.mapToViewModel(task) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    const { data: owners } = await getUsers();
     this.setState({owners});
    await this.populateTask();
  }

  mapToViewModel(task) {
    return {
      _id: task._id,
      title: task.title,
      status: task.status,
      description: task.description,
      comment: task.comment,
      owner: task.owner
    };
  }

  doSubmit = async () => {
    await saveTask(this.state.data);

    this.props.history.push("/tasks");
  }

  render() {
    return (
      <div>
        <h1>Task Form</h1>
        
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderInput("description", "Description")}
          {this.renderSelect("status", "Status", this.state.status)}
          {this.renderInput("comment", "Comment")}
          {this.renderSelect("owner", "Owner", this.state.owners)}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default TaskForm;
