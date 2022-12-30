import React, { useState } from 'react';
import './css/style.scss';
import Routes from './router';



function saveToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  return sessionStorage.getItem('token');
}

function App() {


  return <Routes />;

}

export default App;
