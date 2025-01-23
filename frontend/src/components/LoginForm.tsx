import React, { useState } from 'react';
import { loginUser } from '../services/services';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      localStorage.setItem('token', result.token || ''); // Save token in local storage (or session storage)
      navigate('/'); // Redirect to the dashboard or another page
    } catch (error: any) {
      setErrorMessage(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default LoginForm;
