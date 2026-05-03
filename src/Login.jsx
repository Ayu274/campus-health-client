import React, { useState } from "react";
import { loginUser } from "./api";

const style = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  .login-bg {
    min-height: 100vh;
    background: #1c1c1c;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .login-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .login-brand h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1c1c1c;
    margin-bottom: 4px;
  }
  .login-brand p {
    color: #0d7c6e;
    font-size: .85rem;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .form-group {
    margin-bottom: 16px;
  }
  label {
    display: block;
    font-size: .8rem;
    font-weight: 600;
    color: #1c1c1c;
    margin-bottom: 6px;
  }
  input, select {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e2ddd8;
    border-radius: 8px;
    font-size: .875rem;
    font-family: inherit;
    outline: none;
    transition: border .18s;
  }
  input:focus, select:focus { border-color: #0d7c6e; }
  .btn-login {
    width: 100%;
    padding: 12px;
    background: #0d7c6e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    font-family: inherit;
    transition: background .18s;
  }
  .btn-login:hover { background: #0a6a5e; }
  .error { color: #d94040; font-size: .8rem; margin-top: 12px; text-align: center; }
  .loading { opacity: .7; cursor: not-allowed; }
`;

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form.email, form.password, form.role);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{style}</style>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-brand">
            <h1>🏥 CampusHealth</h1>
            <p>Management System</p>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@campus.edu"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label>Login As</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button
            className={`btn-login ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="error">{error}</div>}
          <div style={{marginTop: 20, padding: 14, background: "#f0ede8", borderRadius: 8, fontSize: ".78rem", color: "#6b6b6b"}}>
            <strong>Demo credentials:</strong><br/>
            Email: admin@campus.edu<br/>
            Password: admin123<br/>
            Role: Admin
          </div>
        </div>
      </div>
    </>
  );
}
