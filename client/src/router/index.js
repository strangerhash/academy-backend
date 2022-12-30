import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../componets/auth';



function saveToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  return sessionStorage.getItem('token');
}

function Router() {
  const [token, setToken] = useState(getToken());

  const setTokenHandler = _token => {
    saveToken(_token);
    setToken(_token);
  };


  return (
    <>
      <Switch>

       

      </Switch>

    </>
  );
}

export default Router;
