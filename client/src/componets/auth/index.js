import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
function getToken() {
  // return null;
  return sessionStorage.getItem('token');
}
const permissions = ['customers']; //and so on.....

export default function ({ children, ...rest }) {
  const [token, setToken] = useState(getToken());
  const module = rest.module || '';
  return (
    <Route
      {...rest}
      render={() => {
        return token ? children : <Redirect to="/"></Redirect>;
      }}
    />
  );
}
