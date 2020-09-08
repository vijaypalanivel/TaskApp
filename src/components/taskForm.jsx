import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getTask, saveTask } from "../services/taskService";

class TaskForm extends Form {
  state = {
    data: {
      title: "",
      status: "",
      description: "",
      comment: ""
    },
    status: [{id:'New', name:'New'},{id:'Pending', name:'Pending'},
    {id:'Done', name:'Done'},{id:'Approved', name:'Approved'}],
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
      .label("Comment")
    
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
    await this.populateTask();
  }

  mapToViewModel(task) {
    return {
      _id: task._id,
      title: task.title,
      status: task.status,
      description: task.description,
      comment: task.comment
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
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default TaskForm;
