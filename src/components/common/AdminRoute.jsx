import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const AdminRoute = ({ path, component: Component, render, ...rest }) => {

  const user = auth.getCurrentUser();
  return (
    
    <Route
      {...rest}
      render={props => {
        if (user && !user.isAdmin || !user) 
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default AdminRoute;
