import React, { useState } from "react";

// ─── Palette & Design System ───────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #f0ede8;
    --surface:  #ffffff;
    --card:     #faf9f7;
    --teal:     #0d7c6e;
    --teal-lt:  #e6f4f1;
    --teal-mid: #1aaa96;
    --amber:    #e8861a;
    --amber-lt: #fef3e2;
    --red:      #d94040;
    --red-lt:   #fdeaea;
    --blue:     #2458c8;
    --blue-lt:  #eaf0fd;
    --ink:      #1c1c1c;
    --muted:    #6b6b6b;
    --border:   #e2ddd8;
    --shadow:   0 2px 12px rgba(0,0,0,.07);
    --shadow-lg:0 8px 32px rgba(0,0,0,.12);
    --r:        12px;
    --r-sm:     8px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

  .serif { font-family: 'DM Serif Display', serif; }

  /* Layout */
  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 240px; background: var(--ink); color: #fff;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh;
    z-index: 100;
  }
  .sidebar-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,.1);
  }
  .sidebar-brand h1 { font-family:'DM Serif Display',serif; font-size:1.3rem; line-height:1.2; color:#fff; }
  .sidebar-brand span { font-size:.72rem; color: var(--teal-mid); letter-spacing:.08em; text-transform:uppercase; }
  .sidebar-nav { flex:1; padding: 12px 0; overflow-y:auto; }
  .nav-section { padding: 14px 20px 6px; font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.35); }
  .nav-item {
    display:flex; align-items:center; gap:10px;
    padding: 10px 20px; cursor:pointer; font-size:.875rem;
    color:rgba(255,255,255,.65); transition: all .18s;
    border-left: 3px solid transparent;
  }
  .nav-item:hover { background:rgba(255,255,255,.06); color:#fff; }
  .nav-item.active { background:rgba(13,124,110,.25); color: var(--teal-mid); border-left-color: var(--teal-mid); }
  .nav-icon { font-size:1.1rem; width:20px; text-align:center; }
  .sidebar-footer { padding:16px 20px; border-top:1px solid rgba(255,255,255,.1); }
  .avatar-row { display:flex; align-items:center; gap:10px; }
  .avatar { width:34px;height:34px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;color:#fff; }
  .avatar-info { font-size:.8rem; }
  .avatar-info .name { color:#fff; font-weight:500; }
  .avatar-info .role { color:rgba(255,255,255,.4); font-size:.7rem; }

  /* Main */
  .main { margin-left:240px; flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .topbar {
    background: var(--surface); border-bottom:1px solid var(--border);
    padding: 0 28px; height:60px; display:flex; align-items:center; justify-content:space-between;
    position:sticky; top:0; z-index:50; box-shadow: var(--shadow);
  }
  .topbar-left h2 { font-family:'DM Serif Display',serif; font-size:1.3rem; }
  .topbar-left p { font-size:.78rem; color:var(--muted); }
  .topbar-right { display:flex; align-items:center; gap:14px; }
  .btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:var(--r-sm); font-size:.84rem;
    font-weight:500; cursor:pointer; border:none; transition:all .18s; font-family:inherit;
  }
  .btn-primary { background:var(--teal); color:#fff; }
  .btn-primary:hover { background:#0a6a5e; }
  .btn-outline { background:transparent; border:1.5px solid var(--border); color:var(--ink); }
  .btn-outline:hover { border-color:var(--teal); color:var(--teal); }
  .btn-sm { padding:5px 12px; font-size:.78rem; }
  .btn-danger { background:var(--red-lt); color:var(--red); border:none; }
  .btn-amber { background:var(--amber-lt); color:var(--amber); border:none; }

  .content { padding: 28px; flex:1; }

  /* Stats row */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
  .stat-card {
    background:var(--surface); border-radius:var(--r); padding:20px;
    border:1px solid var(--border); box-shadow:var(--shadow);
    display:flex; align-items:center; gap:14px;
  }
  .stat-icon { width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem; flex-shrink:0; }
  .stat-body .value { font-size:1.6rem; font-weight:700; font-family:'DM Serif Display',serif; }
  .stat-body .label { font-size:.76rem; color:var(--muted); margin-top:2px; }
  .stat-body .delta { font-size:.72rem; margin-top:4px; }
  .delta-up { color:var(--teal); } .delta-dn { color:var(--red); }

  /* Two-col */
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
  .three-col { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:28px; }

  /* Panel */
  .panel {
    background:var(--surface); border-radius:var(--r); border:1px solid var(--border);
    box-shadow:var(--shadow); overflow:hidden;
  }
  .panel-header {
    padding:16px 20px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
  }
  .panel-title { font-size:.95rem; font-weight:600; }
  .panel-body { padding:20px; }

  /* Table */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:.84rem; }
  th { padding:10px 14px; text-align:left; font-size:.72rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); border-bottom:1.5px solid var(--border); white-space:nowrap; }
  td { padding:12px 14px; border-bottom:1px solid var(--border); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:#faf9f7; }

  /* Badge */
  .badge { display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:.72rem;font-weight:600; }
  .badge-green { background:var(--teal-lt); color:var(--teal); }
  .badge-amber { background:var(--amber-lt); color:var(--amber); }
  .badge-red   { background:var(--red-lt);   color:var(--red);   }
  .badge-blue  { background:var(--blue-lt);  color:var(--blue);  }
  .badge-gray  { background:#f0ede8; color:var(--muted); }

  /* Form */
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .form-group { display:flex; flex-direction:column; gap:6px; }
  .form-group.full { grid-column:1/-1; }
  label { font-size:.78rem; font-weight:600; color:var(--ink); }
  input, select, textarea {
    padding:9px 12px; border:1.5px solid var(--border); border-radius:var(--r-sm);
    font-size:.875rem; font-family:inherit; color:var(--ink); background:var(--surface);
    transition:border .18s; outline:none;
  }
  input:focus, select:focus, textarea:focus { border-color:var(--teal); }
  textarea { resize:vertical; min-height:80px; }
  .form-actions { display:flex; gap:10px; margin-top:20px; justify-content:flex-end; }

  /* Modal */
  .modal-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;
    display:flex;align-items:center;justify-content:center;padding:20px;
  }
  .modal {
    background:var(--surface);border-radius:var(--r);width:100%;max-width:560px;
    box-shadow:var(--shadow-lg);animation:fadeUp .22s ease;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .modal-header { padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between; }
  .modal-header h3 { font-family:'DM Serif Display',serif; font-size:1.2rem; }
  .modal-body { padding:24px; }
  .close-btn { background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--muted);line-height:1; }

  /* Appointment list */
  .appt-item {
    display:flex;align-items:center;gap:12px;padding:12px 0;
    border-bottom:1px solid var(--border);
  }
  .appt-item:last-child { border-bottom:none; }
  .appt-time { font-size:.72rem;font-weight:600;color:var(--muted);min-width:70px; }
  .appt-info { flex:1; }
  .appt-info .patient { font-weight:500;font-size:.875rem; }
  .appt-info .detail { font-size:.75rem;color:var(--muted); }
  .appt-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }

  /* Calendar mini */
  .mini-cal { font-size:.82rem; }
  .cal-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-weight:600; }
  .cal-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center; }
  .cal-day-name { font-size:.68rem;color:var(--muted);padding:4px 0;font-weight:600; }
  .cal-day { padding:6px 4px;border-radius:6px;cursor:pointer;transition:background .15s; }
  .cal-day:hover { background:var(--teal-lt); }
  .cal-day.today { background:var(--teal);color:#fff;font-weight:700; }
  .cal-day.has-event { position:relative; }
  .cal-day.has-event::after { content:'';position:absolute;bottom:1px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--amber); }
  .cal-day.other-month { color:var(--border); }
  .cal-day.selected { background:var(--teal-lt);color:var(--teal);font-weight:600; }

  /* Quick actions */
  .quick-actions { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
  .quick-btn {
    padding:14px;border-radius:var(--r-sm);border:1.5px solid var(--border);
    background:var(--card);cursor:pointer;text-align:left;transition:all .18s;font-family:inherit;
  }
  .quick-btn:hover { border-color:var(--teal);background:var(--teal-lt); }
  .quick-btn .qb-icon { font-size:1.3rem;margin-bottom:6px; }
  .quick-btn .qb-label { font-size:.8rem;font-weight:600;color:var(--ink); }
  .quick-btn .qb-sub { font-size:.7rem;color:var(--muted); }

  /* Doctor card */
  .doctor-card {
    background:var(--card);border-radius:var(--r-sm);border:1px solid var(--border);
    padding:16px;display:flex;align-items:center;gap:14px;
  }
  .doc-avatar { width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;flex-shrink:0; }
  .doc-info .name { font-weight:600;font-size:.875rem; }
  .doc-info .spec { font-size:.75rem;color:var(--muted); }
  .doc-info .avail { font-size:.72rem;margin-top:4px; }

  /* Search bar */
  .search-bar {
    display:flex;align-items:center;gap:8px;background:var(--card);
    border:1.5px solid var(--border);border-radius:var(--r-sm);
    padding:8px 12px;margin-bottom:16px;
  }
  .search-bar input { border:none;background:transparent;flex:1;font-size:.875rem;outline:none; }
  .search-icon { color:var(--muted); }

  /* Rx card */
  .rx-card { padding:14px 0;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:flex-start; }
  .rx-card:last-child { border-bottom:none; }
  .rx-icon { width:36px;height:36px;background:var(--blue-lt);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0; }
  .rx-info .drug { font-weight:600;font-size:.875rem; }
  .rx-info .detail { font-size:.75rem;color:var(--muted);margin-top:2px; }
  .rx-meta { margin-left:auto;text-align:right;font-size:.75rem;color:var(--muted); }

  /* Analytics bar */
  .bar-row { display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:.8rem; }
  .bar-label { min-width:110px;color:var(--muted); }
  .bar-track { flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden; }
  .bar-fill { height:100%;border-radius:4px;transition:width .6s ease; }
  .bar-val { min-width:36px;text-align:right;font-weight:600; }

  /* Empty state */
  .empty { text-align:center;padding:40px 20px;color:var(--muted); }
  .empty .emoji { font-size:2.5rem;margin-bottom:12px; }
  .empty p { font-size:.875rem; }

  /* Alert */
  .alert { padding:12px 16px;border-radius:var(--r-sm);font-size:.84rem;margin-bottom:16px;display:flex;gap:10px;align-items:flex-start; }
  .alert-warn { background:var(--amber-lt);color:#7a4a00;border:1px solid #f5d5a0; }
  .alert-info { background:var(--blue-lt);color:#1a3a7a;border:1px solid #b8cef5; }

  /* Responsive nudge */
  @media (max-width:1100px) {
    .stats-grid { grid-template-columns:repeat(2,1fr); }
    .two-col, .three-col { grid-template-columns:1fr; }
  }
`;

// ─── Mock Data ─────────────────────────────────────────────────────────────
const APPOINTMENTS = [
  { id:1, patient:"Dwithun Baglary",   studentId:"CS2021045", doctor:"Dr. Priya Nair",    dept:"General",   time:"09:00 AM", date:"2026-04-05", status:"confirmed", reason:"Fever & headache" },
  { id:2, patient:"Gibson Lama",     studentId:"EE2022018", doctor:"Dr. Rajesh Kumar",  dept:"ENT",        time:"09:45 AM", date:"2026-04-05", status:"waiting",   reason:"Ear pain" },
  { id:3, patient:"Chijom Ngucho",      studentId:"ME2020033", doctor:"Dr. Priya Nair",    dept:"General",   time:"10:30 AM", date:"2026-04-05", status:"confirmed", reason:"Routine checkup" },
  { id:4, patient:"Tonaya Gogoi",     studentId:"CS2023071", doctor:"Dr. Anita Das",     dept:"Gynecology", time:"11:15 AM", date:"2026-04-05", status:"cancelled", reason:"Follow-up" },
  { id:5, patient:"Pranab Kalita",   studentId:"CE2021089", doctor:"Dr. Rajesh Kumar",  dept:"ENT",        time:"02:00 PM", date:"2026-04-05", status:"confirmed", reason:"Sore throat" },
  { id:6, patient:"Rina Hazarika",   studentId:"BT2022014", doctor:"Dr. Suresh Baruah", dept:"Ortho",      time:"03:30 PM", date:"2026-04-06", status:"confirmed", reason:"Knee pain" },
];
const DOCTORS = [
  { id:1, name:"Dr. Priya Nair",    spec:"General Medicine", color:"#0d7c6e", avail:"Mon–Fri, 9–11 AM",  patients:24, status:"available" },
  { id:2, name:"Dr. Rajesh Kumar",  spec:"ENT Specialist",   color:"#2458c8", avail:"Mon–Wed, 2–4 PM",   patients:18, status:"available" },
  { id:3, name:"Dr. Anita Das",     spec:"Gynecology",       color:"#b94eb4", avail:"Tue–Thu, 10–12 PM", patients:15, status:"busy" },
  { id:4, name:"Dr. Suresh Baruah", spec:"Orthopedics",      color:"#e8861a", avail:"Mon/Wed/Fri, 3–5 PM",patients:12,status:"available" },
];
const STUDENTS = [
  { id:"CS2021045", name:"Dwithun Baglary",  dept:"Computer Science", year:3, blood:"B+", allergies:"Penicillin", dob:"2002-03-14", phone:"9876543210", visits:5  },
  { id:"EE2022018", name:"Gibson Lama",    dept:"Electrical Eng.",  year:2, blood:"O+", allergies:"None",       dob:"2003-07-22", phone:"9871234560", visits:2  },
  { id:"ME2020033", name:"Chijom Ngucho",     dept:"Mech. Eng.",       year:4, blood:"A-", allergies:"Sulfa",      dob:"2001-11-05", phone:"9864321098", visits:8  },
  { id:"CE2021089", name:"Pranab Kalita",  dept:"Civil Eng.",       year:3, blood:"AB+",allergies:"None",       dob:"2002-01-30", phone:"9812345678", visits:3  },
  { id:"BT2022014", name:"Rina Hazarika",  dept:"Biotechnology",    year:2, blood:"O-", allergies:"Aspirin",    dob:"2003-05-18", phone:"9898765432", visits:6  },
];
const PRESCRIPTIONS = [
  { id:1, patient:"Dwithun Baglary", studentId:"CS2021045", drug:"Paracetamol 500mg", dose:"1 tab", freq:"TDS × 5 days", doctor:"Dr. Priya Nair",    date:"2026-04-05", dispensed:false },
  { id:2, patient:"Chijom Ngucho",    studentId:"ME2020033", drug:"Ibuprofen 400mg",   dose:"1 tab", freq:"BD × 3 days",  doctor:"Dr. Suresh Baruah", date:"2026-04-04", dispensed:true  },
  { id:3, patient:"Gibson Lama",   studentId:"EE2022018", drug:"Amoxicillin 250mg", dose:"1 cap", freq:"TDS × 7 days", doctor:"Dr. Rajesh Kumar",  date:"2026-04-03", dispensed:true  },
  { id:4, patient:"Rina Hazarika", studentId:"BT2022014", drug:"Naproxen 250mg",    dose:"1 tab", freq:"BD × 5 days",  doctor:"Dr. Suresh Baruah", date:"2026-04-05", dispensed:false },
];
const RECORDS = [
  { id:1, studentId:"CS2021045", type:"Diagnosis",   date:"2026-04-05", note:"Viral fever, mild dehydration. Prescribed rest and fluids.", doctor:"Dr. Priya Nair"    },
  { id:2, studentId:"CS2021045", type:"Prescription",date:"2026-04-05", note:"Paracetamol 500mg TDS × 5 days",                            doctor:"Dr. Priya Nair"    },
  { id:3, studentId:"ME2020033", type:"Diagnosis",   date:"2026-04-04", note:"Mild knee sprain. Advised physiotherapy.",                  doctor:"Dr. Suresh Baruah" },
  { id:4, studentId:"ME2020033", type:"Lab Report",  date:"2026-03-28", note:"CBC normal. Vitamin D deficient — supplementation advised.", doctor:"Dr. Priya Nair"    },
];

// ─── Calendar Helper ────────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }) {
  const [month, setMonth] = useState(new Date(2026, 3, 1));
  const days = [];
  const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const total = new Date(month.getFullYear(), month.getMonth()+1, 0).getDate();
  const prevTotal = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  const eventDays = [3,5,8,12,15,22];
  for (let i=0;i<first;i++) days.push({ d:prevTotal-first+1+i, cur:false });
  for (let i=1;i<=total;i++) days.push({ d:i, cur:true });
  const rem = 42 - days.length;
  for (let i=1;i<=rem;i++) days.push({ d:i, cur:false });
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div className="mini-cal">
      <div className="cal-header">
        <button className="btn btn-outline btn-sm" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}>‹</button>
        <span>{months[month.getMonth()]} {month.getFullYear()}</span>
        <button className="btn btn-outline btn-sm" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}>›</button>
      </div>
      <div className="cal-grid">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-day-name">{d}</div>)}
        {days.map((d,i)=>{
          const isToday = d.cur && d.d===5 && month.getMonth()===3;
          const sel = d.cur && selected===d.d;
          const hasEv = d.cur && eventDays.includes(d.d);
          return <div key={i} className={`cal-day${isToday?" today":""}${sel&&!isToday?" selected":""}${hasEv?" has-event":""}${!d.cur?" other-month":""}`} onClick={()=>d.cur&&onSelect(d.d)}>{d.d}</div>;
        })}
      </div>
    </div>
  );
}

// ─── Modals ─────────────────────────────────────────────────────────────────
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

function NewAppointmentModal({ onClose, onSave }) {
  const [form, setForm] = useState({ patient:"", studentId:"", doctor:"", reason:"", date:"", time:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Book New Appointment" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={e=>set("patient",e.target.value)} placeholder="Full name" /></div>
        <div className="form-group"><label>Student ID</label><input value={form.studentId} onChange={e=>set("studentId",e.target.value)} placeholder="e.g. CS2021045" /></div>
        <div className="form-group"><label>Doctor</label>
          <select value={form.doctor} onChange={e=>set("doctor",e.target.value)}>
            <option value="">Select doctor</option>
            {DOCTORS.map(d=><option key={d.id}>{d.name} — {d.spec}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></div>
        <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={e=>set("time",e.target.value)} /></div>
        <div className="form-group full"><label>Reason for Visit</label><textarea value={form.reason} onChange={e=>set("reason",e.target.value)} placeholder="Describe symptoms or reason..." /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>{onSave(form);onClose();}}>Book Appointment</button>
      </div>
    </Modal>
  );
}

function NewPrescriptionModal({ onClose }) {
  return (
    <Modal title="Write Prescription" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group"><label>Patient / Student ID</label><input placeholder="Student ID" /></div>
        <div className="form-group"><label>Drug Name</label><input placeholder="e.g. Paracetamol 500mg" /></div>
        <div className="form-group"><label>Dosage</label><input placeholder="e.g. 1 tablet" /></div>
        <div className="form-group"><label>Frequency</label><input placeholder="e.g. TDS × 5 days" /></div>
        <div className="form-group full"><label>Notes</label><textarea placeholder="Additional instructions..." /></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={onClose}>Save Prescription</button>
      </div>
    </Modal>
  );
}

// ─── Pages ──────────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const [selDay, setSelDay] = useState(5);
  const [showApptModal, setShowApptModal] = useState(false);
  const todayAppts = APPOINTMENTS.filter(a=>a.date==="2026-04-05");

  return (
    <>
      {showApptModal && <NewAppointmentModal onClose={()=>setShowApptModal(false)} onSave={()=>{}} />}

      <div className="stats-grid">
        {[
          { icon:"📅", label:"Today's Appointments", value:todayAppts.length, delta:"↑ 2 from yesterday", up:true,  bg:"#e6f4f1", ic:"#0d7c6e" },
          { icon:"👤", label:"Registered Students",  value:"2,841",           delta:"↑ 12 this week",    up:true,  bg:"#eaf0fd", ic:"#2458c8" },
          { icon:"💊", label:"Prescriptions Today",  value:PRESCRIPTIONS.filter(p=>p.date==="2026-04-05").length, delta:"↓ 1 from yesterday", up:false, bg:"#fef3e2", ic:"#e8861a" },
          { icon:"🏥", label:"Active Doctors",       value:DOCTORS.filter(d=>d.status==="available").length, delta:"All on duty", up:true, bg:"#fdeaea", ic:"#d94040" },
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="stat-body">
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
              <div className={`delta ${s.up?"delta-up":"delta-dn"}`}>{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="three-col">
        {/* Today's appointments */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">📅 Today's Schedule</span>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowApptModal(true)}>+ Book</button>
          </div>
          <div className="panel-body">
            {todayAppts.map(a=>(
              <div key={a.id} className="appt-item">
                <div className="appt-dot" style={{background: a.status==="confirmed"?"#0d7c6e":a.status==="waiting"?"#e8861a":"#d94040"}} />
                <div className="appt-time">{a.time}</div>
                <div className="appt-info">
                  <div className="patient">{a.patient}</div>
                  <div className="detail">{a.doctor} · {a.dept}</div>
                </div>
                <span className={`badge badge-${a.status==="confirmed"?"green":a.status==="waiting"?"amber":"red"}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">🗓 Calendar</span></div>
            <div className="panel-body">
              <MiniCalendar selected={selDay} onSelect={setSelDay} />
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">⚡ Quick Actions</span></div>
            <div className="panel-body">
              <div className="quick-actions">
                {[
                  {icon:"📋",label:"New Appointment",sub:"Book a slot",action:()=>setShowApptModal(true)},
                  {icon:"💊",label:"Prescriptions",sub:"View / write",action:()=>setPage("pharmacy")},
                  {icon:"🔍",label:"Student Lookup",sub:"Search records",action:()=>setPage("records")},
                  {icon:"📊",label:"Analytics",sub:"View reports",action:()=>setPage("analytics")},
                ].map((q,i)=>(
                  <button key={i} className="quick-btn" onClick={q.action}>
                    <div className="qb-icon">{q.icon}</div>
                    <div className="qb-label">{q.label}</div>
                    <div className="qb-sub">{q.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department load */}
      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><span className="panel-title">📊 Department Load (This Month)</span></div>
          <div className="panel-body">
            {[
              {label:"General Medicine", val:68, color:"var(--teal)"},
              {label:"ENT",              val:42, color:"var(--blue)"},
              {label:"Orthopedics",      val:31, color:"var(--amber)"},
              {label:"Gynecology",       val:25, color:"#b94eb4"},
              {label:"Ophthalmology",    val:19, color:"var(--red)"},
            ].map(b=>(
              <div key={b.label} className="bar-row">
                <span className="bar-label">{b.label}</span>
                <div className="bar-track"><div className="bar-fill" style={{width:`${b.val}%`,background:b.color}} /></div>
                <span className="bar-val">{b.val}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><span className="panel-title">👨‍⚕️ On-Duty Doctors</span></div>
          <div className="panel-body" style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {DOCTORS.map(d=>(
              <div key={d.id} className="doctor-card">
                <div className="doc-avatar" style={{background:d.color}}>{d.name.split(" ")[1][0]}{d.name.split(" ")[2]?.[0]}</div>
                <div className="doc-info" style={{flex:1}}>
                  <div className="name">{d.name}</div>
                  <div className="spec">{d.spec}</div>
                  <div className="avail">{d.avail}</div>
                </div>
                <span className={`badge badge-${d.status==="available"?"green":"amber"}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Appointments() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? APPOINTMENTS : APPOINTMENTS.filter(a=>a.status===filter);
  return (
    <>
      {showModal && <NewAppointmentModal onClose={()=>setShowModal(false)} onSave={()=>{}} />}
      <div className="alert alert-info">ℹ️ <span>Showing all appointments. Use filters to narrow by status.</span></div>
      <div className="panel">
        <div className="panel-header">
          <div style={{display:"flex",gap:"8px"}}>
            {["all","confirmed","waiting","cancelled"].map(f=>(
              <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-outline"}`} onClick={()=>setFilter(f)} style={{textTransform:"capitalize"}}>{f}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ New Appointment</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Patient</th><th>Student ID</th><th>Doctor</th><th>Dept</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td><strong>{a.patient}</strong></td>
                  <td style={{color:"var(--muted)",fontSize:".78rem"}}>{a.studentId}</td>
                  <td>{a.doctor}</td>
                  <td>{a.dept}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td style={{maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.reason}</td>
                  <td><span className={`badge badge-${a.status==="confirmed"?"green":a.status==="waiting"?"amber":"red"}`}>{a.status}</span></td>
                  <td><button className="btn btn-outline btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function MedicalRecords() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = STUDENTS.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.id.toLowerCase().includes(search.toLowerCase()));
  const recs = selected ? RECORDS.filter(r=>r.studentId===selected.id) : [];
  return (
    <div className="two-col" style={{alignItems:"start"}}>
      <div>
        <div className="search-bar"><span className="search-icon">🔍</span><input placeholder="Search by name or student ID..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <div className="panel">
          <div className="panel-header"><span className="panel-title">👤 Student Registry</span></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Year</th><th>Blood</th><th>Visits</th><th></th></tr></thead>
              <tbody>
                {filtered.map(s=>(
                  <tr key={s.id} style={{background:selected?.id===s.id?"var(--teal-lt)":""}}>
                    <td style={{fontSize:".75rem",color:"var(--muted)"}}>{s.id}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.dept}</td>
                    <td>Year {s.year}</td>
                    <td><span className="badge badge-red">{s.blood}</span></td>
                    <td>{s.visits}</td>
                    <td><button className="btn btn-outline btn-sm" onClick={()=>setSelected(s)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        {selected ? (
          <>
            <div className="panel" style={{marginBottom:"16px"}}>
              <div className="panel-header"><span className="panel-title">🪪 Student Profile</span><button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>✕ Clear</button></div>
              <div className="panel-body">
                <div style={{display:"flex",gap:"14px",alignItems:"center",marginBottom:"16px"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"var(--teal)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"1.2rem"}}>{selected.name[0]}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:"1rem"}}>{selected.name}</div>
                    <div style={{fontSize:".78rem",color:"var(--muted)"}}>{selected.id} · {selected.dept} · Year {selected.year}</div>
                  </div>
                </div>
                <div className="form-grid" style={{gap:"10px"}}>
                  {[["DOB",selected.dob],["Blood Group",selected.blood],["Allergies",selected.allergies],["Phone",selected.phone]].map(([l,v])=>(
                    <div key={l} style={{background:"var(--bg)",borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontSize:".68rem",color:"var(--muted)",marginBottom:2}}>{l}</div>
                      <div style={{fontWeight:600,fontSize:".875rem"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><span className="panel-title">📋 Medical History</span><button className="btn btn-primary btn-sm">+ Add Entry</button></div>
              <div className="panel-body">
                {recs.length===0 ? <div className="empty"><div className="emoji">📂</div><p>No records found for this student.</p></div>
                : recs.map(r=>(
                  <div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span className={`badge badge-${r.type==="Diagnosis"?"blue":r.type==="Prescription"?"green":"amber"}`}>{r.type}</span>
                      <span style={{fontSize:".72rem",color:"var(--muted)"}}>{r.date}</span>
                    </div>
                    <div style={{fontSize:".84rem",margin:"6px 0"}}>{r.note}</div>
                    <div style={{fontSize:".72rem",color:"var(--muted)"}}>{r.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="panel"><div className="empty"><div className="emoji">👆</div><p>Select a student to view their profile and medical records.</p></div></div>
        )}
      </div>
    </div>
  );
}

function Doctors() {
  return (
    <>
      <div className="panel" style={{marginBottom:"20px"}}>
        <div className="panel-header"><span className="panel-title">👨‍⚕️ Doctor & Staff Directory</span><button className="btn btn-primary btn-sm">+ Add Doctor</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Specialization</th><th>Availability</th><th>Patients (Month)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {DOCTORS.map(d=>(
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:d.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".8rem",flexShrink:0}}>{d.name.split(" ")[1][0]}</div>
                      <strong>{d.name}</strong>
                    </div>
                  </td>
                  <td>{d.spec}</td>
                  <td style={{fontSize:".8rem",color:"var(--muted)"}}>{d.avail}</td>
                  <td>{d.patients}</td>
                  <td><span className={`badge badge-${d.status==="available"?"green":"amber"}`}>{d.status}</span></td>
                  <td style={{display:"flex",gap:6}}>
                    <button className="btn btn-outline btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><span className="panel-title">📅 Leave Requests</span></div>
          <div className="panel-body">
            <div className="empty"><div className="emoji">✅</div><p>No pending leave requests.</p></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><span className="panel-title">⏰ Duty Roster</span></div>
          <div className="panel-body">
            {DOCTORS.map(d=>(
              <div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:".84rem"}}>
                <span style={{fontWeight:500}}>{d.name}</span>
                <span style={{color:"var(--muted)",fontSize:".78rem"}}>{d.avail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Pharmacy() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? PRESCRIPTIONS : PRESCRIPTIONS.filter(p=>(filter==="dispensed")===p.dispensed);
  return (
    <>
      {showModal && <NewPrescriptionModal onClose={()=>setShowModal(false)} />}
      <div className="panel" style={{marginBottom:"20px"}}>
        <div className="panel-header">
          <div style={{display:"flex",gap:"8px"}}>
            {[["all","All"],["pending","Pending"],["dispensed","Dispensed"]].map(([v,l])=>(
              <button key={v} className={`btn btn-sm ${filter===v?"btn-primary":"btn-outline"}`} onClick={()=>setFilter(v)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>+ Write Prescription</button>
        </div>
        <div className="panel-body">
          {filtered.map(p=>(
            <div key={p.id} className="rx-card">
              <div className="rx-icon">💊</div>
              <div className="rx-info" style={{flex:1}}>
                <div className="drug">{p.drug}</div>
                <div className="detail">{p.dose} · {p.freq}</div>
                <div className="detail" style={{marginTop:4}}>Patient: <strong>{p.patient}</strong> ({p.studentId}) · {p.doctor}</div>
              </div>
              <div className="rx-meta">
                <div>{p.date}</div>
                <span className={`badge badge-${p.dispensed?"green":"amber"}`} style={{marginTop:4}}>{p.dispensed?"Dispensed":"Pending"}</span>
                {!p.dispensed && <div style={{marginTop:6}}><button className="btn btn-primary btn-sm">Dispense</button></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">📦 Inventory (Low Stock Alert)</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Drug</th><th>Category</th><th>Stock</th><th>Unit</th><th>Expiry</th><th>Status</th></tr></thead>
            <tbody>
              {[
                {drug:"Paracetamol 500mg",cat:"Analgesic",stock:240,unit:"tabs",exp:"2027-06",status:"ok"},
                {drug:"Ibuprofen 400mg",  cat:"NSAID",    stock:85, unit:"tabs",exp:"2026-12",status:"ok"},
                {drug:"Amoxicillin 250mg",cat:"Antibiotic",stock:18,unit:"caps",exp:"2026-09",status:"low"},
                {drug:"ORS Sachet",       cat:"Rehydration",stock:6,unit:"pkt",exp:"2027-03",status:"critical"},
                {drug:"Antacid Syrup",    cat:"GI",       stock:12,unit:"btl",exp:"2026-08",status:"low"},
              ].map((m,i)=>(
                <tr key={i}>
                  <td><strong>{m.drug}</strong></td>
                  <td>{m.cat}</td>
                  <td style={{fontWeight:700}}>{m.stock}</td>
                  <td style={{color:"var(--muted)"}}>{m.unit}</td>
                  <td>{m.exp}</td>
                  <td><span className={`badge badge-${m.status==="ok"?"green":m.status==="low"?"amber":"red"}`}>{m.status==="ok"?"In Stock":m.status==="low"?"Low Stock":"Critical"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Analytics() {
  return (
    <>
      <div className="stats-grid">
        {[
          {icon:"📈",label:"Total Visits (This Month)",value:"312",bg:"var(--teal-lt)",ic:"var(--teal)"},
          {icon:"🕐",label:"Avg. Wait Time",           value:"18 min",bg:"var(--blue-lt)",ic:"var(--blue)"},
          {icon:"💊",label:"Prescriptions (Month)",    value:"198",bg:"var(--amber-lt)",ic:"var(--amber)"},
          {icon:"⭐",label:"Patient Satisfaction",     value:"4.6/5",bg:"var(--red-lt)",ic:"var(--red)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg,color:s.ic}}>{s.icon}</div>
            <div className="stat-body"><div className="value">{s.value}</div><div className="label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-header"><span className="panel-title">📊 Visits by Department</span></div>
          <div className="panel-body">
            {[["General Medicine",68,"var(--teal)"],["ENT",42,"var(--blue)"],["Orthopedics",31,"var(--amber)"],["Gynecology",25,"#b94eb4"],["Ophthalmology",19,"var(--red)"],["Dermatology",14,"#0a9a8c"]].map(([l,v,c])=>(
              <div key={l} className="bar-row">
                <span className="bar-label" style={{fontSize:".78rem"}}>{l}</span>
                <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:c}} /></div>
                <span className="bar-val">{v}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><span className="panel-title">🗂 Visit Trends</span></div>
          <div className="panel-body">
            {[["Jan",42],["Feb",58],["Mar",71],["Apr",55]].map(([m,v])=>(
              <div key={m} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <span style={{minWidth:32,fontSize:".78rem",color:"var(--muted)",fontWeight:600}}>{m}</span>
                <div style={{flex:1,height:28,background:"var(--bg)",borderRadius:6,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",width:`${(v/80)*100}%`,background:"var(--teal)",borderRadius:6,display:"flex",alignItems:"center",paddingLeft:10,color:"#fff",fontSize:".78rem",fontWeight:700,transition:"width .6s"}}>{v}</div>
                </div>
              </div>
            ))}
            <div className="alert alert-warn" style={{marginTop:8}}>⚠️ <span>April data is partial (month in progress).</span></div>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">🔬 Common Diagnoses (This Month)</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Diagnosis</th><th>Cases</th><th>% Share</th><th>Trend</th></tr></thead>
            <tbody>
              {[["Viral Fever",68,"21.8%","↑"],["Respiratory Infection",54,"17.3%","↑"],["Gastroenteritis",41,"13.1%","→"],["Musculoskeletal Pain",38,"12.2%","↓"],["Migraine/Headache",29,"9.3%","→"],["Anxiety/Stress",27,"8.7%","↑"]].map(([d,c,p,t])=>(
                <tr key={d}>
                  <td><strong>{d}</strong></td>
                  <td>{c}</td>
                  <td><span className="badge badge-blue">{p}</span></td>
                  <td style={{fontSize:"1.1rem",color:t==="↑"?"var(--red)":t==="↓"?"var(--teal)":"var(--muted)"}}>{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── App Shell ───────────────────────────────────────────────────────────────
const NAV = [
  { section:"Main" },
  { id:"dashboard",    label:"Dashboard",        icon:"🏠" },
  { id:"appointments", label:"Appointments",      icon:"📅" },
  { id:"records",      label:"Medical Records",   icon:"📋" },
  { section:"Staff" },
  { id:"doctors",      label:"Doctors & Staff",   icon:"👨‍⚕️" },
  { section:"Services" },
  { id:"pharmacy",     label:"Pharmacy & Rx",     icon:"💊" },
  { id:"analytics",    label:"Reports & Analytics",icon:"📊" },
];

const PAGE_TITLES = {
  dashboard:"Dashboard", appointments:"Appointments",
  records:"Medical Records", doctors:"Doctors & Staff",
  pharmacy:"Pharmacy & Prescriptions", analytics:"Reports & Analytics"
};

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch(page) {
      case "dashboard":    return <Dashboard setPage={setPage} />;
      case "appointments": return <Appointments />;
      case "records":      return <MedicalRecords />;
      case "doctors":      return <Doctors />;
      case "pharmacy":     return <Pharmacy />;
      case "analytics":    return <Analytics />;
      default:             return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{style}</style>
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
                    <span className="nav-icon">{n.icon}</span>{n.label}
                  </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="avatar-row">
              <div className="avatar">AD</div>
              <div className="avatar-info">
                <div className="name">Admin</div>
                <div className="role">Health Center</div>
              </div>
            </div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h2 className="serif">{PAGE_TITLES[page]}</h2>
              <p>Sunday, April 05, 2026 · Campus Health Center</p>
            </div>
            <div className="topbar-right">
              <button className="btn btn-outline btn-sm">🔔 Alerts</button>
              <button className="btn btn-outline btn-sm">⚙️ Settings</button>
            </div>
          </div>
          <div className="content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
