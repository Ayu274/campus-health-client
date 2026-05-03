const API = "https://campus-health-api.onrender.com";

// ─── Auth ───────────────────────────────────────────────
export const loginUser = async (email, password, role) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  return res.json();
};

export const registerUser = async (email, password, role) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  return res.json();
};

// ─── Helper ─────────────────────────────────────────────
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Students ───────────────────────────────────────────
export const getStudents = async (search = "") => {
  const res = await fetch(`${API}/api/students?search=${search}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const addStudent = async (student) => {
  const res = await fetch(`${API}/api/students`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(student),
  });
  return res.json();
};

export const getStudentById = async (id) => {
  const res = await fetch(`${API}/api/students/${id}`, {
    headers: authHeaders(),
  });
  return res.json();
};

// ─── Appointments ────────────────────────────────────────
export const getAppointments = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/api/appointments?${params}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const bookAppointment = async (appointment) => {
  const res = await fetch(`${API}/api/appointments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(appointment),
  });
  return res.json();
};

export const updateAppointmentStatus = async (id, status, notes = "") => {
  const res = await fetch(`${API}/api/appointments/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, notes }),
  });
  return res.json();
};

// ─── Doctors ────────────────────────────────────────────
export const getDoctors = async () => {
  const res = await fetch(`${API}/api/doctors`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const addDoctor = async (doctor) => {
  const res = await fetch(`${API}/api/doctors`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(doctor),
  });
  return res.json();
};

// ─── Medical Records ────────────────────────────────────
export const getStudentRecords = async (studentId) => {
  const res = await fetch(`${API}/api/records/student/${studentId}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const addRecord = async (record) => {
  const res = await fetch(`${API}/api/records`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(record),
  });
  return res.json();
};

// ─── Prescriptions ──────────────────────────────────────
export const getPrescriptions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/api/prescriptions?${params}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const addPrescription = async (prescription) => {
  const res = await fetch(`${API}/api/prescriptions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(prescription),
  });
  return res.json();
};

export const dispensePrescription = async (id) => {
  const res = await fetch(`${API}/api/prescriptions/${id}/dispense`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
};

// ─── Inventory ──────────────────────────────────────────
export const getInventory = async () => {
  const res = await fetch(`${API}/api/inventory`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const getInventoryAlerts = async () => {
  const res = await fetch(`${API}/api/inventory/alerts`, {
    headers: authHeaders(),
  });
  return res.json();
};

// ─── Analytics ──────────────────────────────────────────
export const getAnalyticsSummary = async () => {
  const res = await fetch(`${API}/api/analytics/summary`, {
    headers: authHeaders(),
  });
  return res.json();
};
