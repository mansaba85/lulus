const API_URL = '/api';

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_URL}/settings`);
    return res.json();
  },
  updateSettings: async (settings) => {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Classes
  getClasses: async () => {
    const res = await fetch(`${API_URL}/classes`);
    return res.json();
  },
  addClass: async (name) => {
    const res = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },
  updateClass: async (id, name) => {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },
  deleteClass: async (id) => {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Students
  getStudents: async () => {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
  },
  addStudent: async (student) => {
    const res = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },
  updateStudent: async (id, student) => {
    const res = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },
  deleteStudent: async (id) => {
    const res = await fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },
  bulkImportStudents: async (students) => {
    const res = await fetch(`${API_URL}/students/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(students)
    });
    return res.json();
  },
  searchStudent: async (token) => {
    const res = await fetch(`${API_URL}/students/search/${token}`);
    if (res.status === 404) return null;
    return res.json();
  }
};
