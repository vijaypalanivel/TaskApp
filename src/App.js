import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navbar";
import Tasks from "./components/tasks";
import TaskForm from './components/taskForm';
import NotFound from "./components/notFound";
import LoginForm from './components/loginForm';
import UserForm from "./components/userForm";
import Logout from "./components/logout";
import Profile from "./components/profile";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AdminRoute from "./components/common/AdminRoute";



class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <AdminRoute path="/users" component={UserForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <AdminRoute path="/tasks/:id" component={TaskForm} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute
              path="/tasks"
              render={props => <Tasks {...props} user={this.state.user} />}
            />
            <Route path="/not-found" component={NotFound} />
            
            <Redirect from="/" exact to="/tasks" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
