import React, { Component } from "react";
import { Link } from "react-router-dom";
import TasksTable from "./tasksTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { getTasks, deleteTask } from "../services/taskService";
import SearchBox from "./searchBox";
import _ from "lodash";

class Tasks extends Component {
  state = {
    tasks: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {

    const { data: tasks } = await getTasks();
    this.setState({ tasks });
  }

  handleDelete = task => {
    const tasks = this.state.tasks.filter(m => m._id !== task._id);
    this.setState({ tasks });

    deleteTask(task._id);
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      tasks: allTasks
    } = this.state;

    let filtered = allTasks;
    if (searchQuery)
      filtered = allTasks.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allTasks.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const tasks = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: tasks };
  };

  render() {
    const { length: count } = this.state.tasks;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no tasks in the database.</p>;

    const { totalCount, data: tasks } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-12">
        {user && user.isAdmin &&(
          <Link
            to="/task/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Task
          </Link>)}
          <p>Showing {totalCount} task in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <TasksTable
            tasks={tasks}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Tasks;
