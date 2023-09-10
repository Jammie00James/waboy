import React, { useState } from 'react';
import './App.css'; // Import your CSS file for styling (if needed)

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here, e.g., send a request to your backend
    console.log('Username:', username);
    console.log('Password:', password);
    // You can add authentication logic here
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login Page</h1>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="button" onClick={handleLogin} className="login-button">
            Login
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
