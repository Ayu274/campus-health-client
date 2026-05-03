import React, { useState, useEffect, useCallback } from "react";

// ─── API Configuration ──────────────────────────────────────────────────────
const API = "https://campus-health-api.onrender.com";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: authHeaders(),
      ...options,
    });
    return res.json();
  } catch (err) {
    return { error: "Network error. Please try again." };
  }
};

// ─── Design System ──────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f0ede8; --surface:#ffffff; --card:#faf9f7;
    --teal:#0d7c6e; --teal-lt:#e6f4f1; --teal-mid:#1aaa96;
    --amber:#e8861a; --amber-lt:#fef3e2;
    --red:#d94040; --red-lt:#fdeaea;
    --blue:#2458c8; --blue-lt:#eaf0fd;
    --ink:#1c1c1c; --muted:#6b6b6b; --border:#e2ddd8;
    --shadow:0 2px 12px rgba(0,0,0,.07);
    --shadow-lg:0 8px 32px rgba(0,0,0,.12);
    --r:12px; --r-sm:8px;
  }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--ink); }
  .serif { font-family:'DM Serif Display',serif; }
  .app { display:flex; min-height:100vh; }
  .sidebar { width:240px; background:var(--ink); color:#fff; display:flex; flex-direction:column; position:fixed; top:0; left:0; height:100vh; z-index:100; }
  .sidebar-brand { padding:24px 20px 20px; border-bottom:1px solid rgba(255,255,255,.1); }
  .sidebar-brand h1 { font-family:'DM Serif Display',serif; font-size:1.3rem; line-height:1.2; color:#fff; }
  .sidebar-brand span { font-size:.72rem; color:var(--teal-mid); letter-spacing:.08em; text-transform:uppercase; }
  .sidebar-nav { flex:1; padding:12px 0; overflow-y:auto; }
  .nav-section { padding:14px 20px 6px; font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.35); }
  .nav-item { display:flex; align-items:center; gap:10px; padding:10px 20px; cursor:pointer; font-size:.875rem; color:rgba(255,255,255,.65); transition:all .18s; border-left:3px solid transparent; }
  .nav-item:hover { background:rgba(255,255,255,.06); color:#fff; }
  .nav-item.active { background:rgba(13,124,110,.25); color:var(--teal-mid); border-left-color:var(--teal-mid); }
  .sidebar-footer { padding:16px 20px; border-top:1px solid rgba(255,255,255,.1); }
  .avatar-row { display:flex; align-items:center; gap:10px; }
  .avatar { width:34px; height:34px; border-radius:50%; background:var(--teal); display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:600; color:#fff; }
  .avatar-info .name { color:#fff; font-weight:500; font-size:.8rem; }
  .avatar-info .role { color:rgba(255,255,255,.4); font-size:.7rem; }
  .logout-btn { margin-top:10px; width:100%; padding:8px; background:rgba(217,64,64,.2); color:#ff8080; border:none; border-radius:var(--r-sm); cursor:pointer; font-size:.8rem; font-family:inherit; transition:all .18s; }
  .logout-btn:hover { background:rgba(217,64,64,.4); }
  .main { margin-left:240px; flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:0 28px; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; box-shadow:var(--shadow); }
  .topbar-left h2 { font-family:'DM Serif Display',serif; font-size:1.3rem; }
  .topbar-left p { font-size:.78rem; color:var(--muted); }
  .content { padding:28px; flex:1; }
  .btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:var(--r-sm); font-size:.84rem; font-weight:500; cursor:pointer; border:none; transition:all .18s; font-family:inherit; }
  .btn-primary { background:var(--teal); color:#fff; }
  .btn-primary:hover { background:#0a6a5e; }
  .btn-outline { background:transparent; border:1.5px solid var(--border); color:var(--ink); }
  .btn-outline:hover { border-color:var(--teal); color:var(--teal); }
  .btn-sm { padding:5px 12px; font-size:.78rem; }
  .btn-danger { background:var(--red-lt); color:var(--red); border:none; }
  .btn-success { background:var(--teal-lt); color:var(--teal); border:none; }
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
  .stat-card { background:var(--surface); border-radius:var(--r); padding:20px; border:1px solid var(--border); box-shadow:var(--shadow); display:flex; align-items:center; gap:14px; }
  .stat-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
  .stat-body .value { font-size:1.6rem; font-weight:700; font-family:'DM Serif Display',serif; }
  .stat-body .label { font-size:.76rem; color:var(--muted); margin-top:2px; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
  .three-col { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:28px; }
  .panel { background:var(--surface); border-radius:var(--r); border:1px solid var(--border); box-shadow:var(--shadow); overflow:hidden; margin-bottom:20px; }
  .panel-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .panel-title { font-size:.95rem; font-weight:600; }
  .panel-body { padding:20px; }
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:.84rem; }
  th { padding:10px 14px; text-align:left; font-size:.72rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); border-bottom:1.5px solid var(--border); }
  td { padding:12px 14px; border-bottom:1px solid var(--border); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:#faf9f7; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; font-size:.72rem; font-weight:600; }
  .badge-green { background:var(--teal-lt); color:var(--teal); }
  .badge-amber { background:var(--amber-lt); color:var(--amber); }
  .badge-red { background:var(--red-lt); color:var(--red); }
  .badge-blue { background:var(--blue-lt); color:var(--blue); }
  .badge-gray { background:#f0ede8; color:var(--muted); }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .form-group { display:flex; flex-direction:column; gap:6px; }
  .form-group.full { grid-column:1/-1; }
  label { font-size:.78rem; font-weight:600; color:var(--ink); }
  input, select, textarea { padding:9px 12px; border:1.5px solid var(--border); border-radius:var(--r-sm); font-size:.875rem; font-family:inherit; color:var(--ink); background:var(--surface); transition:border .18s; outline:none; }
  input:focus, select:focus, textarea:focus { border-color:var(--teal); }
  textarea { resize:vertical; min-height:80px; }
  .form-actions { display:flex; gap:10px; margin-top:20px; justify-content:flex-end; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:var(--surface); border-radius:var(--r); width:100%; max-width:560px; box-shadow:var(--shadow-lg); animation:fadeUp .22s ease; max-height:90vh; overflow-y:auto; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .modal-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .modal-header h3 { font-family:'DM Serif Display',serif; font-size:1.2rem; }
  .modal-body { padding:24px; }
  .close-btn { background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--muted); }
  .search-bar { display:flex; align-items:center; gap:8px; background:var(--card); border:1.5px solid var(--border); border-radius:var(--r-sm); padding:8px 12px; margin-bottom:16px; }
  .search-bar input { border:none; background:transparent; flex:1; font-size:.875rem; outline:none; }
  .empty { text-align:center; padding:40px 20px; color:var(--muted); }
  .empty .emoji { font-size:2.5rem; margin-bottom:12px; }
  .alert { padding:12px 16px; border-radius:var(--r-sm); font-size:.84rem; margin-bottom:16px; display:flex; gap:10px; align-items:center; }
  .alert-success { background:var(--teal-lt); color:var(--teal); border:1px solid #b0ddd8; }
  .alert-error { background:var(--red-lt); color:var(--red); border:1px solid #f5b0b0; }
  .alert-info { background:var(--blue-lt); color:var(--blue); border:1px solid #b8cef5; }
  .loading-spinner { text-align:center; padding:40px; color:var(--muted); font-size:.9rem; }
  .appt-item { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .appt-item:last-child { border-bottom:none; }
  .appt-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .appt-time { font-size:.72rem; font-weight:600; color:var(--muted); min-width:70px; }
  .appt-info { flex:1; }
  .appt-info .patient { font-weight:500; font-size:.875rem; }
  .appt-info .detail { font-size:.75rem; color:var(--muted); }
  .bar-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; font-size:.8rem; }
  .bar-label { min-width:110px; color:var(--muted); }
  .bar-track { flex:1; height:8px; background:var(--border); border-radius:4px; overflow:hidden; }
  .bar-fill { height:100%; border-radius:4px; }
  .bar-val { min-width:36px; text-align:right; font-weight:600; }

  /* Login */
  .login-bg { min-height:100vh; background:var(--ink); display:flex; align-items:center; justify-content:center; padding:20px; }
  .login-card { background:#fff; border-radius:16px; padding:40px; width:100%; max-width:420px; box-shadow:var(--shadow-lg); }
  .login-brand h1 { font-size:1.8rem; font-weight:700; color:var(--ink); margin-bottom:4px; font-family:'DM Serif Display',serif; }
  .login-brand p { color:var(--teal); font-size:.85rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; margin-bottom:32px; }
  .btn-login { width:100%; padding:12px; background:var(--teal); color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; margin-top:8px; font-family:inherit; transition:background .18s; }
  .btn-login:hover { background:#0a6a5e; }
  .demo-box { margin-top:20px; padding:14px; background:#f0ede8; border-radius:8px; font-size:.78rem; color:var(--muted); }

  @media(max-width:1100px) {
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .two-col, .three-col { grid-template-columns:1fr; }
  }
`;

// ─── Toast Notification ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:999,maxWidth:320}}>
      <div className={`alert alert-${type}`} style={{boxShadow:"var(--shadow-lg)"}}>
        {type==="success"?"✅":type==="error"?"❌":"ℹ️"} {message}
      </div>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Login Page ─────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [form, setForm] = useState({ email:"", password:"", role:"admin" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch { setError("Server error. Please try again."); }
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
          {["email","password"].map(f=>(
            <div key={f} className="form-group" style={{marginBottom:16}}>
              <label style={{marginBottom:6}}>{f==="email"?"Email Address":"Password"}</label>
              <input type={f} placeholder={f==="email"?"admin@campus.edu":"••••••••"}
                value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
            </div>
          ))}
          <div className="form-group" style={{marginBottom:16}}>
            <label style={{marginBottom:6}}>Login As</label>
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button className="btn-login" onClick={handleLogin} disabled={loading}>
            {loading?"Logging in...":"Login →"}
          </button>
          {error && <div style={{color:"var(--red)",fontSize:".8rem",marginTop:12,textAlign:"center"}}>{error}</div>}
          <div className="demo-box">
            <strong>Demo credentials:</strong><br/>
            Email: admin@campus.edu · Password: admin123
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ setPage, showToast }) {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/analytics/summary"),
      apiFetch("/api/appointments")
    ]).then(([s, a]) => {
      setStats(s);
      setAppointments(a.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-spinner">⏳ Loading dashboard...</div>;

  const todayAppts = appointments.slice(0, 5);

  return (
    <>
      {showModal && <NewAppointmentModal onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false);showToast("Appointment booked!","success");}} />}
      <div className="stats-grid">
        {[
          {icon:"📅",label:"Today's Appointments",value:stats?.today_appointments??0,bg:"#e6f4f1",ic:"#0d7c6e"},
          {icon:"👤",label:"Registered Students",value:stats?.total_students??0,bg:"#eaf0fd",ic:"#2458c8"},
          {icon:"💊",label:"Prescriptions Today",value:stats?.prescriptions_today??0,bg:"#fef3e2",ic:"#e8861a"},
          {icon:"🏥",label:"Active Doctors",value:stats?.active_doctors??0,bg:"#fdeaea",ic:"#d94040"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="stat-body">
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="three-col">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">📅 Today's Appointments</span>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ Book</button>
          </div>
          <div className="panel-body">
            {todayAppts.length === 0
              ? <div className="empty"><div className="emoji">📭</div><p>No appointments today.</p></div>
              : todayAppts.map((a,i)=>(
                <div key={i} className="appt-item">
                  <div className="appt-dot" style={{background:a.status==="confirmed"?"#0d7c6e":a.status==="waiting"?"#e8861a":"#d94040"}} />
                  <div className="appt-time">{a.appointment_time}</div>
                  <div className="appt-info">
                    <div className="patient">{a.patient_name||a.student_id}</div>
                    <div className="detail">{a.doctor_name} · {a.specialization}</div>
                  </div>
                  <span className={`badge badge-${a.status==="confirmed"?"green":a.status==="waiting"?"amber":"red"}`}>{a.status}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">⚡ Quick Actions</span></div>
            <div className="panel-body">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {icon:"📋",label:"New Appointment",action:()=>setShowModal(true)},
                  {icon:"👤",label:"Add Student",action:()=>setPage("students")},
                  {icon:"💊",label:"Prescriptions",action:()=>setPage("pharmacy")},
                  {icon:"📊",label:"Analytics",action:()=>setPage("analytics")},
                ].map((q,i)=>(
                  <button key={i} onClick={q.action} style={{padding:14,borderRadius:8,border:"1.5px solid var(--border)",background:"var(--card)",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .18s"}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor="var(--teal)";e.currentTarget.style.background="var(--teal-lt)"}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--card)"}}>
                    <div style={{fontSize:"1.3rem",marginBottom:6}}>{q.icon}</div>
                    <div style={{fontSize:".8rem",fontWeight:600}}>{q.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── New Appointment Modal ───────────────────────────────────────────────────
function NewAppointmentModal({ onClose, onSave }) {
  const [form, setForm] = useState({ student_id:"", doctor_id:"", appointment_date:"", appointment_time:"", reason:"" });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { apiFetch("/api/doctors").then(d=>setDoctors(d.data||[])); }, []);

  const handleSave = async () => {
    if (!form.student_id||!form.doctor_id||!form.appointment_date||!form.appointment_time) {
      setError("Please fill all required fields."); return;
    }
    setLoading(true);
    const result = await apiFetch("/api/appointments", {
      method:"POST", body:JSON.stringify(form)
    });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    onSave();
  };

  return (
    <Modal title="📅 Book New Appointment" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid">
        <div className="form-group"><label>Student ID *</label><input value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} placeholder="e.g. CS2021045" /></div>
        <div className="form-group"><label>Doctor *</label>
          <select value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})}>
            <option value="">Select doctor</option>
            {doctors.map(d=><option key={d.id} value={d.id}>{d.full_name} — {d.specialization}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Date *</label><input type="date" value={form.appointment_date} onChange={e=>setForm({...form,appointment_date:e.target.value})} /></div>
        <div className="form-group"><label>Time *</label><input type="time" value={form.appointment_time} onChange={e=>setForm({...form,appointment_time:e.target.value})} /></div>
        <div className="form-group full"><label>Reason</label><textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Describe symptoms..." /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading?"Booking...":"Book Appointment"}</button>
      </div>
    </Modal>
  );
}

// ─── Appointments Page ───────────────────────────────────────────────────────
function Appointments({ showToast }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/api/appointments").then(d=>{
      setAppointments(d.data||[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/appointments/${id}/status`, { method:"PATCH", body:JSON.stringify({status}) });
    showToast(`Appointment ${status}!`, "success");
    load();
  };

  const filtered = filter==="all" ? appointments : appointments.filter(a=>a.status===filter);

  return (
    <>
      {showModal && <NewAppointmentModal onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false);showToast("Appointment booked!","success");load();}} />}
      <div className="panel">
        <div className="panel-header">
          <div style={{display:"flex",gap:8}}>
            {["all","confirmed","waiting","completed","cancelled"].map(f=>(
              <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-outline"}`} onClick={()=>setFilter(f)} style={{textTransform:"capitalize"}}>{f}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ New Appointment</button>
        </div>
        {loading ? <div className="loading-spinner">⏳ Loading...</div> :
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length===0 ? <tr><td colSpan={8}><div className="empty"><div className="emoji">📭</div><p>No appointments found.</p></div></td></tr>
                : filtered.map((a,i)=>(
                  <tr key={a.id}>
                    <td>{i+1}</td>
                    <td><strong>{a.patient_name||a.student_id}</strong></td>
                    <td>{a.doctor_name}</td>
                    <td>{a.appointment_date}</td>
                    <td>{a.appointment_time}</td>
                    <td style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.reason}</td>
                    <td><span className={`badge badge-${a.status==="confirmed"?"green":a.status==="waiting"?"amber":a.status==="completed"?"blue":"red"}`}>{a.status}</span></td>
                    <td style={{display:"flex",gap:4}}>
                      {a.status!=="completed" && <button className="btn btn-success btn-sm" onClick={()=>updateStatus(a.id,"completed")}>✓ Done</button>}
                      {a.status!=="cancelled" && <button className="btn btn-danger btn-sm" onClick={()=>updateStatus(a.id,"cancelled")}>✕</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
}

// ─── Students Page ───────────────────────────────────────────────────────────
function Students({ showToast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [records, setRecords] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch(`/api/students?search=${search}`).then(d=>{
      setStudents(d.data||[]);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const viewRecords = async (student) => {
    setSelected(student);
    const r = await apiFetch(`/api/records/student/${student.id}`);
    setRecords(r.records||[]);
  };

  return (
    <>
      {showModal && <AddStudentModal onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false);showToast("Student registered!","success");load();}} />}
      <div className="two-col" style={{alignItems:"start"}}>
        <div>
          <div className="search-bar"><span>🔍</span><input placeholder="Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">👤 Students</span><button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ Add Student</button></div>
            {loading ? <div className="loading-spinner">⏳ Loading...</div> :
              <div className="table-wrap">
                <table>
                  <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Year</th><th>Blood</th><th></th></tr></thead>
                  <tbody>
                    {students.length===0 ? <tr><td colSpan={6}><div className="empty"><div className="emoji">👤</div><p>No students found.</p></div></td></tr>
                    : students.map(s=>(
                      <tr key={s.id} style={{background:selected?.id===s.id?"var(--teal-lt)":""}}>
                        <td style={{fontSize:".75rem",color:"var(--muted)"}}>{s.id}</td>
                        <td><strong>{s.full_name}</strong></td>
                        <td>{s.department}</td>
                        <td>Year {s.year}</td>
                        <td><span className="badge badge-red">{s.blood_group}</span></td>
                        <td><button className="btn btn-outline btn-sm" onClick={()=>viewRecords(s)}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
        <div>
          {selected ? (
            <div className="panel">
              <div className="panel-header"><span className="panel-title">📋 {selected.full_name}</span><button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>✕</button></div>
              <div className="panel-body">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[["ID",selected.id],["Department",selected.department],["Blood",selected.blood_group],["Phone",selected.phone||"N/A"]].map(([l,v])=>(
                    <div key={l} style={{background:"var(--bg)",borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontSize:".68rem",color:"var(--muted)",marginBottom:2}}>{l}</div>
                      <div style={{fontWeight:600,fontSize:".875rem"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontWeight:600,marginBottom:12}}>Medical History</div>
                {records.length===0 ? <div className="empty"><div className="emoji">📂</div><p>No records found.</p></div>
                : records.map(r=>(
                  <div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span className={`badge badge-${r.record_type==="diagnosis"?"blue":"green"}`}>{r.record_type}</span>
                      <span style={{fontSize:".72rem",color:"var(--muted)"}}>{r.created_at?.slice(0,10)}</span>
                    </div>
                    <div style={{fontSize:".84rem",margin:"6px 0"}}>{r.content}</div>
                    <div style={{fontSize:".72rem",color:"var(--muted)"}}>{r.doctor_name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="panel"><div className="empty"><div className="emoji">👆</div><p>Select a student to view their profile.</p></div></div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Add Student Modal ───────────────────────────────────────────────────────
function AddStudentModal({ onClose, onSave }) {
  const [form, setForm] = useState({ id:"", full_name:"", department:"", year:1, blood_group:"", phone:"", gender:"male" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.id||!form.full_name||!form.department) { setError("ID, name and department are required."); return; }
    setLoading(true);
    const result = await apiFetch("/api/students", { method:"POST", body:JSON.stringify(form) });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    onSave();
  };

  return (
    <Modal title="👤 Register New Student" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid">
        <div className="form-group"><label>Student ID *</label><input value={form.id} onChange={e=>setForm({...form,id:e.target.value})} placeholder="e.g. CS2024001" /></div>
        <div className="form-group"><label>Full Name *</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Full name" /></div>
        <div className="form-group"><label>Department *</label><input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="e.g. Computer Science" /></div>
        <div className="form-group"><label>Year</label>
          <select value={form.year} onChange={e=>setForm({...form,year:parseInt(e.target.value)})}>
            {[1,2,3,4,5,6].map(y=><option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Blood Group</label>
          <select value={form.blood_group} onChange={e=>setForm({...form,blood_group:e.target.value})}>
            <option value="">Select</option>
            {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="10-digit number" /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading?"Saving...":"Register Student"}</button>
      </div>
    </Modal>
  );
}

// ─── Doctors Page ────────────────────────────────────────────────────────────
function Doctors({ showToast }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch("/api/doctors").then(d=>{ setDoctors(d.data||[]); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      {showModal && <AddDoctorModal onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false);showToast("Doctor added!","success");load();}} />}
      <div className="panel">
        <div className="panel-header"><span className="panel-title">👨‍⚕️ Doctors & Staff</span><button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ Add Doctor</button></div>
        {loading ? <div className="loading-spinner">⏳ Loading...</div> :
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Specialization</th><th>Phone</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {doctors.length===0 ? <tr><td colSpan={6}><div className="empty"><div className="emoji">👨‍⚕️</div><p>No doctors added yet.</p></div></td></tr>
                : doctors.map((d,i)=>(
                  <tr key={d.id}>
                    <td>{i+1}</td>
                    <td><strong>{d.full_name}</strong></td>
                    <td>{d.specialization}</td>
                    <td>{d.phone||"N/A"}</td>
                    <td><span className={`badge badge-${d.status==="available"?"green":"amber"}`}>{d.status}</span></td>
                    <td><button className="btn btn-outline btn-sm">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
}

// ─── Add Doctor Modal ────────────────────────────────────────────────────────
function AddDoctorModal({ onClose, onSave }) {
  const [form, setForm] = useState({ full_name:"", staff_type:"doctor", specialization:"", qualification:"", license_no:"", phone:"", email:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.full_name||!form.specialization) { setError("Name and specialization are required."); return; }
    setLoading(true);
    const result = await apiFetch("/api/doctors", { method:"POST", body:JSON.stringify(form) });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    onSave();
  };

  return (
    <Modal title="👨‍⚕️ Add Doctor" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid">
        <div className="form-group"><label>Full Name *</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Dr. Full Name" /></div>
        <div className="form-group"><label>Specialization *</label><input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} placeholder="e.g. General Medicine" /></div>
        <div className="form-group"><label>Qualification</label><input value={form.qualification} onChange={e=>setForm({...form,qualification:e.target.value})} placeholder="e.g. MBBS, MD" /></div>
        <div className="form-group"><label>License No.</label><input value={form.license_no} onChange={e=>setForm({...form,license_no:e.target.value})} placeholder="Medical license" /></div>
        <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number" /></div>
        <div className="form-group"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="doctor@campus.edu" /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading?"Saving...":"Add Doctor"}</button>
      </div>
    </Modal>
  );
}

// ─── Pharmacy Page ───────────────────────────────────────────────────────────
function Pharmacy({ showToast }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/prescriptions"),
      apiFetch("/api/inventory")
    ]).then(([p,inv])=>{
      setPrescriptions(p.data||[]);
      setInventory(inv.data||[]);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const dispense = async (id) => {
    await apiFetch(`/api/prescriptions/${id}/dispense`, { method:"PATCH" });
    showToast("Prescription dispensed!", "success");
    load();
  };

  const filtered = filter==="all" ? prescriptions : prescriptions.filter(p=>filter==="pending"?!p.dispensed:p.dispensed);

  return (
    <>
      {showModal && <AddPrescriptionModal onClose={()=>setShowModal(false)} onSave={()=>{setShowModal(false);showToast("Prescription created!","success");load();}} />}
      <div className="panel">
        <div className="panel-header">
          <div style={{display:"flex",gap:8}}>
            {[["all","All"],["pending","Pending"],["dispensed","Dispensed"]].map(([v,l])=>(
              <button key={v} className={`btn btn-sm ${filter===v?"btn-primary":"btn-outline"}`} onClick={()=>setFilter(v)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ Write Prescription</button>
        </div>
        {loading ? <div className="loading-spinner">⏳ Loading...</div> :
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Patient</th><th>Doctor</th><th>Items</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.length===0 ? <tr><td colSpan={7}><div className="empty"><div className="emoji">💊</div><p>No prescriptions found.</p></div></td></tr>
                : filtered.map((p,i)=>(
                  <tr key={p.id}>
                    <td>{i+1}</td>
                    <td><strong>{p.patient_name||p.student_id}</strong></td>
                    <td>{p.doctor_name}</td>
                    <td>{p.item_count||"—"} items</td>
                    <td>{p.created_at?.slice(0,10)}</td>
                    <td><span className={`badge badge-${p.dispensed?"green":"amber"}`}>{p.dispensed?"Dispensed":"Pending"}</span></td>
                    <td>{!p.dispensed && <button className="btn btn-primary btn-sm" onClick={()=>dispense(p.id)}>Dispense</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">📦 Drug Inventory</span><button className="btn btn-primary btn-sm" onClick={()=>showToast("Add drug feature coming soon!","info")}>+ Add Drug</button></div>
        {loading ? <div className="loading-spinner">⏳ Loading...</div> :
          <div className="table-wrap">
            <table>
              <thead><tr><th>Drug</th><th>Category</th><th>Stock</th><th>Unit</th><th>Expiry</th><th>Status</th></tr></thead>
              <tbody>
                {inventory.length===0 ? <tr><td colSpan={6}><div className="empty"><div className="emoji">📦</div><p>No inventory items yet.</p></div></td></tr>
                : inventory.map(d=>(
                  <tr key={d.id}>
                    <td><strong>{d.drug_name}</strong></td>
                    <td>{d.category}</td>
                    <td style={{fontWeight:700}}>{d.stock_qty}</td>
                    <td style={{color:"var(--muted)"}}>{d.unit}</td>
                    <td>{d.expiry_date?.slice(0,10)}</td>
                    <td><span className={`badge badge-${d.stock_qty>d.reorder_level?"green":d.stock_qty>0?"amber":"red"}`}>{d.stock_qty>d.reorder_level?"In Stock":d.stock_qty>0?"Low":"Out"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
}

// ─── Add Prescription Modal ──────────────────────────────────────────────────
function AddPrescriptionModal({ onClose, onSave }) {
  const [form, setForm] = useState({ student_id:"", doctor_id:"", notes:"", items:[{ drug_name:"", dose:"", frequency:"", route:"oral" }] });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { apiFetch("/api/doctors").then(d=>setDoctors(d.data||[])); }, []);

  const addItem = () => setForm({...form, items:[...form.items,{drug_name:"",dose:"",frequency:"",route:"oral"}]});
  const updateItem = (i,k,v) => { const items=[...form.items]; items[i]={...items[i],[k]:v}; setForm({...form,items}); };

  const handleSave = async () => {
    if (!form.student_id||!form.doctor_id||form.items[0].drug_name==="") { setError("Please fill all required fields."); return; }
    setLoading(true);
    const result = await apiFetch("/api/prescriptions", { method:"POST", body:JSON.stringify(form) });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    onSave();
  };

  return (
    <Modal title="💊 Write Prescription" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid" style={{marginBottom:16}}>
        <div className="form-group"><label>Student ID *</label><input value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} placeholder="Student ID" /></div>
        <div className="form-group"><label>Doctor *</label>
          <select value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})}>
            <option value="">Select doctor</option>
            {doctors.map(d=><option key={d.id} value={d.id}>{d.full_name}</option>)}
          </select>
        </div>
      </div>
      <div style={{fontWeight:600,marginBottom:10,fontSize:".875rem"}}>💊 Medications</div>
      {form.items.map((item,i)=>(
        <div key={i} className="form-grid" style={{background:"var(--bg)",padding:12,borderRadius:8,marginBottom:10}}>
          <div className="form-group"><label>Drug Name *</label><input value={item.drug_name} onChange={e=>updateItem(i,"drug_name",e.target.value)} placeholder="e.g. Paracetamol 500mg" /></div>
          <div className="form-group"><label>Dose</label><input value={item.dose} onChange={e=>updateItem(i,"dose",e.target.value)} placeholder="e.g. 1 tablet" /></div>
          <div className="form-group"><label>Frequency</label><input value={item.frequency} onChange={e=>updateItem(i,"frequency",e.target.value)} placeholder="e.g. TDS × 5 days" /></div>
          <div className="form-group"><label>Route</label>
            <select value={item.route} onChange={e=>updateItem(i,"route",e.target.value)}>
              {["oral","topical","IV","IM","inhaled"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      ))}
      <button className="btn btn-outline btn-sm" onClick={addItem}>+ Add Another Drug</button>
      <div className="form-group full" style={{marginTop:12}}>
        <label>Notes</label>
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Additional instructions..." />
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading?"Saving...":"Save Prescription"}</button>
      </div>
    </Modal>
  );
}

// ─── Analytics Page ──────────────────────────────────────────────────────────
function Analytics() {
  const [stats, setStats] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/analytics/summary"),
      apiFetch("/api/analytics/diagnoses")
    ]).then(([s,d])=>{
      setStats(s);
      setDiagnoses(d.data||[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-spinner">⏳ Loading analytics...</div>;

  return (
    <>
      <div className="stats-grid">
        {[
          {icon:"📈",label:"Total Appointments",value:stats?.today_appointments??0,bg:"var(--teal-lt)",ic:"var(--teal)"},
          {icon:"👤",label:"Total Students",value:stats?.total_students??0,bg:"var(--blue-lt)",ic:"var(--blue)"},
          {icon:"💊",label:"Prescriptions",value:stats?.prescriptions_today??0,bg:"var(--amber-lt)",ic:"var(--amber)"},
          {icon:"👨‍⚕️",label:"Active Doctors",value:stats?.active_doctors??0,bg:"var(--red-lt)",ic:"var(--red)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="stat-body"><div className="value">{s.value}</div><div className="label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">🔬 Common Diagnoses</span></div>
        {diagnoses.length===0
          ? <div className="empty"><div className="emoji">📊</div><p>No diagnosis data yet. Add medical records to see analytics.</p></div>
          : <div className="table-wrap">
              <table>
                <thead><tr><th>Diagnosis</th><th>Cases</th></tr></thead>
                <tbody>
                  {diagnoses.map((d,i)=>(
                    <tr key={i}><td>{d.diagnosis}</td><td><span className="badge badge-blue">{d.cases}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    </>
  );
}

// ─── Navigation Config ───────────────────────────────────────────────────────
const NAV = [
  {section:"Main"},
  {id:"dashboard",   label:"Dashboard",       icon:"🏠"},
  {id:"appointments",label:"Appointments",     icon:"📅"},
  {id:"students",    label:"Students",         icon:"👤"},
  {section:"Staff"},
  {id:"doctors",     label:"Doctors & Staff",  icon:"👨‍⚕️"},
  {section:"Services"},
  {id:"pharmacy",    label:"Pharmacy & Rx",    icon:"💊"},
  {id:"analytics",   label:"Analytics",        icon:"📊"},
];

const PAGE_TITLES = {
  dashboard:"Dashboard", appointments:"Appointments",
  students:"Student Registry", doctors:"Doctors & Staff",
  pharmacy:"Pharmacy & Prescriptions", analytics:"Analytics"
};

// ─── App Shell ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const showToast = useCallback((message, type="success") => {
    setToast({message, type});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return (
    <>
      <style>{style}</style>
      <Login onLogin={(u)=>setUser(u)} />
    </>
  );

  const renderPage = () => {
    switch(page) {
      case "dashboard":    return <Dashboard setPage={setPage} showToast={showToast} />;
      case "appointments": return <Appointments showToast={showToast} />;
      case "students":     return <Students showToast={showToast} />;
      case "doctors":      return <Doctors showToast={showToast} />;
      case "pharmacy":     return <Pharmacy showToast={showToast} />;
      case "analytics":    return <Analytics />;
      default:             return <Dashboard setPage={setPage} showToast={showToast} />;
    }
  };

  return (
    <>
      <style>{style}</style>
      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} />}
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>Campus<br/>Health</h1>
            <span>Management System</span>
          </div>
          <nav className="sidebar-nav">
            {NAV.map((n,i)=>(
              n.section
                ? <div key={i} className="nav-section">{n.section}</div>
                : <div key={i} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                    <span>{n.icon}</span>{n.label}
                  </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="avatar-row">
              <div className="avatar">{user.email?.[0]?.toUpperCase()}</div>
              <div className="avatar-info">
                <div className="name">{user.email}</div>
                <div className="role">{user.role}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h2 className="serif">{PAGE_TITLES[page]}</h2>
              <p>Campus Health Center · Logged in as {user.role}</p>
            </div>
          </div>
          <div className="content">{renderPage()}</div>
        </main>
      </div>
    </>
  );
}