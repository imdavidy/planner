import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';

let axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
})

import './App.css'

function App() {

  function handleSubmit (e) {
    e.preventDefault();
    axiosInstance.get('/api').then(res => console.log(res.data))
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Planner</h1>
      <div className="card">
        <button onClick={handleSubmit}>
          Log
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
