import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";
import auth from "../services/authService";

class TasksTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: taks => this.user && this.user.isAdmin? 
      <Link to={`/tasks/${taks._id}`}>{taks.title}</Link>:taks.title
    },
    { path: "description", label: "Description" },
    { path: "status", label: "Status" },
    { path: "comment", label: "Comment" }
  ];

  deleteColumn = {
    key: "delete",
    content: task => (
      <button
        onClick={() => this.props.onDelete(task)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    
    if (this.user && this.user.isAdmin) this.columns.push(this.deleteColumn);
  }

  user = auth.getCurrentUser();

  render() {
    const { tasks, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={tasks}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default TasksTable;
