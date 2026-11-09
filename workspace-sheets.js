// Springboards for Community Development - Google Workspace (Sheets & Classroom) Integration
// Handles Client-Side OAuth 2.0 with Google Sheets & Google Classroom APIs
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDocFromServer
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "springboards-community-dev",
  appId: "1:651964189612:web:fc444ee616bf91da99c809",
  apiKey: "AIzaSyCZbXdTnbIlmFc6Jm0AYt9scNYJFqGOyB8",
  authDomain: "springboards-community-dev.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-springboardsland-71046992-4c5a-4c20-bdcd-c5ee24b8cc0a",
  storageBucket: "springboards-community-dev.firebasestorage.app",
  messagingSenderId: "651964189612",
  oAuthClientId: "651964189612-jdk3n5qnhq6s8trvrpbemnq4t3djffeo.apps.googleusercontent.com"
};

export const SCOPES = [
  'https://www.googleapis.com/auth/keep',
  'https://www.googleapis.com/auth/keep.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/classroom.addons.student',
  'https://www.googleapis.com/auth/classroom.addons.teacher',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.announcements.readonly',
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
  'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',
  'https://www.googleapis.com/auth/classroom.guardianlinks.students',
  'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.profile.photos',
  'https://www.googleapis.com/auth/classroom.push-notifications',
  'https://www.googleapis.com/auth/classroom.rosters',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
  'https://www.googleapis.com/auth/classroom.topics',
  'https://www.googleapis.com/auth/classroom.topics.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/directory.readonly',
  'https://www.googleapis.com/auth/user.addresses.read',
  'https://www.googleapis.com/auth/user.birthday.read',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/user.gender.read',
  'https://www.googleapis.com/auth/user.organization.read',
  'https://www.googleapis.com/auth/user.phonenumbers.read',
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/chat.admin.delete',
  'https://www.googleapis.com/auth/chat.admin.memberships',
  'https://www.googleapis.com/auth/chat.admin.memberships.readonly',
  'https://www.googleapis.com/auth/chat.admin.spaces',
  'https://www.googleapis.com/auth/chat.admin.spaces.readonly',
  'https://www.googleapis.com/auth/chat.customemojis',
  'https://www.googleapis.com/auth/chat.customemojis.readonly',
  'https://www.googleapis.com/auth/chat.delete',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.messages.reactions',
  'https://www.googleapis.com/auth/chat.messages.reactions.create',
  'https://www.googleapis.com/auth/chat.messages.reactions.readonly',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.create',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.users.readstate',
  'https://www.googleapis.com/auth/chat.users.readstate.readonly',
  'https://www.googleapis.com/auth/chat.users.sections',
  'https://www.googleapis.com/auth/chat.users.sections.readonly',
  'https://www.googleapis.com/auth/chat.users.spacesettings',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly',
  'https://www.googleapis.com/auth/meetings.space.settings'
];

// Initialize Firebase App & Firestore Connection Validation
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Google Auth Provider with Google Workspace Suite scopes
const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

// MANDATORY: In-memory token cache ONLY (Never store tokens in localStorage or sessionStorage)
let cachedAccessToken = null;
let currentUser = null;
let isSigningIn = false;

// Internal state listeners
const listeners = new Set();

export function subscribeWorkspaceAuth(listener) {
  listeners.add(listener);
  listener({ user: currentUser, token: cachedAccessToken });
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn({ user: currentUser, token: cachedAccessToken });
    } catch (e) {
      console.error('[Workspace] Listener callback error:', e);
    }
  });
}

// Track auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    if (!cachedAccessToken && !isSigningIn) {
      cachedAccessToken = null;
    }
  } else {
    currentUser = null;
    cachedAccessToken = null;
  }
  notifyListeners();
});

// Interactive Google Sign-In
export async function signInWithGoogle() {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve Google Workspace OAuth access token.');
    }
    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    notifyListeners();
    syncAuthenticatedUserToCloudSql().catch(() => {});
    return { user: currentUser, accessToken: cachedAccessToken };
  } catch (err) {
    console.error('[Workspace] Google Sign-in error:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
}

// Sign out and clear in-memory token
export async function signOutFromGoogle() {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
  notifyListeners();
}

export function getCachedToken() {
  return cachedAccessToken;
}

export function getCurrentUser() {
  return currentUser;
}

export function isConnected() {
  return Boolean(currentUser && cachedAccessToken);
}

// --- Google Classroom API Functions ---

// 1. List active Google Classroom courses for the signed-in instructor or trainee
export async function listClassroomCourses() {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google to view your Google Classroom courses.');
  }

  const res = await fetch('https://classroom.googleapis.com/v1/courses?pageSize=20', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to load Google Classroom courses (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.courses || [];
}

// 2. Fetch coursework, announcements, topics, and students for a specific course
export async function getClassroomCourseDetails(courseId) {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google to view course details.');
  }

  const headers = { Authorization: `Bearer ${token}` };
  const encodedId = encodeURIComponent(courseId);

  const [cwRes, annRes, topicsRes, studentsRes] = await Promise.all([
    fetch(`https://classroom.googleapis.com/v1/courses/${encodedId}/courseWork?pageSize=15`, { headers }).catch(() => null),
    fetch(`https://classroom.googleapis.com/v1/courses/${encodedId}/announcements?pageSize=10`, { headers }).catch(() => null),
    fetch(`https://classroom.googleapis.com/v1/courses/${encodedId}/topics?pageSize=15`, { headers }).catch(() => null),
    fetch(`https://classroom.googleapis.com/v1/courses/${encodedId}/students?pageSize=30`, { headers }).catch(() => null)
  ]);

  const courseWork = cwRes && cwRes.ok ? ((await cwRes.json().catch(() => ({}))).courseWork || []) : [];
  const announcements = annRes && annRes.ok ? ((await annRes.json().catch(() => ({}))).announcements || []) : [];
  const topics = topicsRes && topicsRes.ok ? ((await topicsRes.json().catch(() => ({}))).topic || []) : [];
  const students = studentsRes && studentsRes.ok ? ((await studentsRes.json().catch(() => ({}))).students || []) : [];

  return { courseWork, announcements, topics, students };
}

// 3. Create a new Springboards Trade Training course in Google Classroom (requires explicit confirmation)
export async function createSpringboardsClassroomCourse({
  name = 'Springboards NCCER Core & OSHA-10 Trade Readiness',
  section = 'East Alabama Cohort — 195-Hour Online & Shop Track',
  descriptionHeading = 'Springboards for Community Development Trade Pathway',
  description = 'Hands-on construction technology, electrical fundamentals, plumbing, HVAC, and OSHA safety certification curriculum.',
  room = 'Springboards Community Center — 2269 15th Ave. S.W., Lanett, AL'
} = {}) {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google first to create a course.');
  }

  const confirmed = window.confirm(
    `Create a new Google Classroom course "${name}" (${section}) in your Google Classroom account?`
  );
  if (!confirmed) return null;

  const res = await fetch('https://classroom.googleapis.com/v1/courses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      section,
      descriptionHeading,
      description,
      room,
      ownerId: 'me',
      courseState: 'PROVISIONED'
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create course (HTTP ${res.status})`);
  }

  return await res.json();
}

// 4. Post an announcement to a Google Classroom course stream (requires explicit confirmation)
export async function postClassroomAnnouncement(courseId, text) {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google first to post an announcement.');
  }
  if (!courseId || !text?.trim()) {
    throw new Error('Course ID and announcement text are required.');
  }

  const confirmed = window.confirm(
    `Post the following announcement to Google Classroom course (${courseId})?\n\n"${text.trim()}"`
  );
  if (!confirmed) return null;

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text.trim(),
      state: 'PUBLISHED'
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to post announcement (HTTP ${res.status})`);
  }

  return await res.json();
}

// 5. Create a coursework assignment in a Google Classroom course (requires explicit confirmation)
export async function createClassroomAssignment(courseId, { title, description, maxPoints = 100 }) {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google first to create an assignment.');
  }
  if (!courseId || !title?.trim()) {
    throw new Error('Course ID and assignment title are required.');
  }

  const confirmed = window.confirm(
    `Create new assignment "${title.trim()}" (${maxPoints} pts) in Google Classroom course (${courseId})?`
  );
  if (!confirmed) return null;

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title.trim(),
      description: (description || '').trim(),
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: Number(maxPoints) || 100
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create assignment (HTTP ${res.status})`);
  }

  return await res.json();
}

// --- Google Sheets API Functions ---

// 1. Create Master Candidate Intake & Attendance Spreadsheet in Google Drive
export async function createMasterSpreadsheet(customTitle = 'Springboards Master Candidate Intake & Attendance Tracker') {
  const token = getCachedToken();
  if (!token) {
    throw new Error('Please sign in with Google first to create your spreadsheet.');
  }

  const confirmed = window.confirm(
    `Create new spreadsheet "${customTitle}" in your Google Sheets account?`
  );
  if (!confirmed) return null;

  const payload = {
    properties: {
      title: customTitle
    },
    sheets: [
      {
        properties: {
          title: 'Candidate Intake',
          gridProperties: {
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'Timestamp' } },
                  { userEnteredValue: { stringValue: 'Candidate Name' } },
                  { userEnteredValue: { stringValue: 'Phone' } },
                  { userEnteredValue: { stringValue: 'Email' } },
                  { userEnteredValue: { stringValue: 'Address & City' } },
                  { userEnteredValue: { stringValue: 'Nearest Career Center' } },
                  { userEnteredValue: { stringValue: 'Confirmed Background Status' } },
                  { userEnteredValue: { stringValue: 'Program Tag' } },
                  { userEnteredValue: { stringValue: 'Career Center Visit Status' } },
                  { userEnteredValue: { stringValue: 'Notes' } }
                ]
              }
            ]
          }
        ]
      },
      {
        properties: {
          title: 'Worksite Daily Attendance',
          gridProperties: {
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'Timestamp' } },
                  { userEnteredValue: { stringValue: 'Work Date' } },
                  { userEnteredValue: { stringValue: 'Candidate ID' } },
                  { userEnteredValue: { stringValue: 'Trainee Name' } },
                  { userEnteredValue: { stringValue: 'Trade Specialty & Role' } },
                  { userEnteredValue: { stringValue: 'Hours Worked Today' } },
                  { userEnteredValue: { stringValue: 'Weekly Hours Logged (Max 32)' } },
                  { userEnteredValue: { stringValue: 'Cumulative Total Hours (390 Cap)' } },
                  { userEnteredValue: { stringValue: '195h Online Learning' } },
                  { userEnteredValue: { stringValue: 'Retention Status' } },
                  { userEnteredValue: { stringValue: 'Training Bay Task' } },
                  { userEnteredValue: { stringValue: 'Supervisor Work Notes' } },
                  { userEnteredValue: { stringValue: 'Sirius Timecard Status' } }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create spreadsheet (HTTP ${response.status})`);
  }

  const result = await response.json();
  const spreadsheetId = result.spreadsheetId;
  const spreadsheetUrl = result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Persist the spreadsheet configuration to backoffice
  await saveSpreadsheetConfig({
    spreadsheetId,
    spreadsheetUrl,
    title: customTitle,
    createdBy: currentUser?.email || 'marilynnlward@gmail.com'
  });

  return { spreadsheetId, spreadsheetUrl, title: customTitle };
}

// 2. Append a single candidate row to the live Google Sheet
export async function appendCandidateToSheet(spreadsheetId, candidate) {
  const token = getCachedToken();
  if (!token || !spreadsheetId) return null;

  const confirmed = window.confirm(
    `Append candidate "${candidate.candidateName || candidate.name || 'Candidate'}" to Google Sheet (${spreadsheetId})?`
  );
  if (!confirmed) return null;

  const range = "'Candidate Intake'!A1";
  const row = [
    candidate.timestamp || new Date().toISOString(),
    candidate.candidateName || candidate.name || '',
    candidate.phone || '',
    candidate.email || '',
    candidate.addressCity || candidate.streetAddress || '',
    candidate.nearestCareerCenter || candidate.matchedCenter || 'Valley Career Center',
    candidate.confirmedBackgroundStatus || candidate.targetBarrier || '',
    candidate.programTag || (candidate.programName?.includes('OJT') ? 'Program: On-The-Job Training (OJT Follow-up)' : 'Transitional Jobs (Activity 220)'),
    candidate.careerCenterVisitStatus || candidate.qualificationStatus || 'Pending Career Center Verification',
    candidate.notes || candidate.intakeNotes || ''
  ];

  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: [row]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[Workspace] Append candidate failed:', err);
      return { success: false, error: err.error?.message };
    }

    const data = await res.json();
    return { success: true, updatedRange: data.updates?.updatedRange };
  } catch (e) {
    console.error('[Workspace] Append candidate error:', e);
    return { success: false, error: e.message };
  }
}

// 3. Append Daily Attendance Clock-In Row to Worksite Daily Attendance Sheet
export async function appendAttendanceToSheet(spreadsheetId, logEntry) {
  const token = getCachedToken();
  if (!token || !spreadsheetId) return null;

  const confirmed = window.confirm(
    `Append daily attendance record for "${logEntry.traineeName || 'Trainee'}" to Google Sheet (${spreadsheetId})?`
  );
  if (!confirmed) return null;

  const range = "'Worksite Daily Attendance'!A1";
  const row = [
    logEntry.syncedAt || new Date().toISOString(),
    logEntry.date || new Date().toISOString().split('T')[0],
    logEntry.candidateId || '',
    logEntry.traineeName || 'Trainee',
    logEntry.trade || 'General Construction',
    logEntry.hoursWorked || 8,
    logEntry.weeklyHoursLogged || 32,
    logEntry.cumulativeHours || 8,
    logEntry.cumulativeHours >= 195 ? 'Completed (195h)' : 'In Progress',
    logEntry.cumulativeHours >= 390 ? 'Permanent Candidate (Internal Retention Review)' : 'Active Worksite Trainee',
    logEntry.taskArea || 'Wall Framing & Bay Assembly',
    logEntry.supervisorNotes || '',
    'Approved for Sirius Workforce LLC'
  ];

  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: [row]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[Workspace] Append attendance failed:', err);
      return { success: false, error: err.error?.message };
    }

    const data = await res.json();
    return { success: true, updatedRange: data.updates?.updatedRange };
  } catch (e) {
    console.error('[Workspace] Append attendance error:', e);
    return { success: false, error: e.message };
  }
}

// 4. Batch Sync All Candidates to Google Sheet
export async function syncAllCandidatesToSheet(spreadsheetId, candidates) {
  const token = getCachedToken();
  if (!token) throw new Error('Not authenticated with Google.');
  if (!spreadsheetId) throw new Error('No target Google Spreadsheet specified.');

  const headers = [
    'Timestamp',
    'Candidate Name',
    'Phone',
    'Email',
    'Address & City',
    'Nearest Career Center',
    'Confirmed Background Status',
    'Program Tag',
    'Career Center Visit Status',
    'Notes'
  ];

  const rows = [headers];
  candidates.forEach(c => {
    rows.push([
      c.timestamp || c.createdAt || new Date().toISOString(),
      c.candidateName || c.name || '',
      c.phone || '',
      c.email || '',
      c.addressCity || c.streetAddress || c.cityZip || '',
      c.nearestCareerCenter || c.matchedCenter || 'Valley Career Center',
      c.confirmedBackgroundStatus || c.targetBarrier || c.backgroundStatus || '',
      c.programTag || (c.programName?.includes('OJT') ? 'Program: On-The-Job Training (OJT Follow-up)' : 'Transitional Jobs (Activity 220)'),
      c.careerCenterVisitStatus || c.qualificationStatus || 'Pending Career Center Verification',
      c.notes || c.intakeNotes || ''
    ]);
  });

  const range = "'Candidate Intake'!A1:J" + rows.length;

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values: rows
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Sync failed with HTTP ${res.status}`);
  }

  // Update backoffice sync timestamp
  await fetch('/api/workspace/sync-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      spreadsheetId,
      rowCount: candidates.length,
      user: currentUser?.email || 'marilynnlward@gmail.com',
      timestamp: new Date().toISOString()
    })
  }).catch(() => {});

  return await res.json();
}

// 5. Verify Spreadsheet Access
export async function testSpreadsheetAccess(spreadsheetId) {
  const token = getCachedToken();
  if (!token) return { accessible: false, error: 'Sign in to test spreadsheet connection.' };

  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties.title`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { accessible: false, error: err.error?.message || 'Access denied or sheet not found.' };
    }

    const data = await res.json();
    return {
      accessible: true,
      title: data.properties?.title,
      sheets: data.sheets?.map(s => s.properties?.title) || []
    };
  } catch (e) {
    return { accessible: false, error: e.message };
  }
}

// Server Config Persistence
export async function getSpreadsheetConfig() {
  try {
    const res = await fetch('/api/workspace/config');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[Workspace] Error loading config:', e);
  }
  return {
    connectedEmail: 'marilynnlward@gmail.com',
    spreadsheetId: '',
    spreadsheetUrl: '',
    autoSync: true
  };
}

export async function saveSpreadsheetConfig(config) {
  try {
    const res = await fetch('/api/workspace/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  } catch (e) {
    console.error('[Workspace] Error saving config:', e);
  }
}

// --- Cloud SQL User & Activity Sync Helper ---
export async function syncAuthenticatedUserToCloudSql() {
  if (!currentUser) return null;
  try {
    const idToken = await currentUser.getIdToken();
    const res = await fetch('/api/sql/user-sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: currentUser.displayName || null
      })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[Workspace] Cloud SQL user sync skipped:', e.message);
  }
  return null;
}

export async function logWorkspaceActivity(service, action, resourceId = '', resourceTitle = '', resourceUrl = '') {
  if (!currentUser) return;
  try {
    const idToken = await currentUser.getIdToken();
    await fetch('/api/sql/workspace-activity', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service,
        action,
        resourceId,
        resourceTitle,
        resourceUrl
      })
    });
  } catch {
    // Non-blocking audit log
  }
}

// --- 1. Google Docs API (docs.googleapis.com & drive.googleapis.com) ---
export async function listGoogleDocs() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view your Google Docs.');

  const q = encodeURIComponent("mimeType='application/vnd.google-apps.document' and trashed=false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=10&fields=files(id,name,webViewLink,modifiedTime)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list Google Docs (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function getGoogleDoc(documentId) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to inspect a document.');

  const res = await fetch(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(documentId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read Google Doc (HTTP ${res.status})`);
  }

  return await res.json();
}

export async function createTrainingManualDoc(title = 'Springboards Trainee Onboarding & OSHA Safety Manual') {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to create a Google Doc.');

  const confirmed = window.confirm(
    `Create a new Google Doc "${title}" in your Google Drive?`
  );
  if (!confirmed) return null;

  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Doc (HTTP ${createRes.status})`);
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  const bodyText =
    `SPRINGBOARDS FOR COMMUNITY DEVELOPMENT\n` +
    `2269 15th Ave. S.W., Lanett (Shawmut), AL 36863 • (615) 603-1157\n\n` +
    `1. PROGRAM OVERVIEW (WIOA ACTIVITY 220 & OJT)\n` +
    `• 195 Hours Blended NCCER Core & OSHA-10 Safety Curriculum\n` +
    `• Up to 390 Hours Paid Transitional Worksite Experience (32 hrs/wk, Mon–Thu 8:00 AM – 4:00 PM)\n\n` +
    `2. REQUIRED INTAKE & CAREER CENTER CHECKLIST\n` +
    `• Valid Government Photo ID & Social Security Verification\n` +
    `• Valley, Opelika, or Phenix City Career Center WIOA Registration\n` +
    `• Personal Protective Equipment (PPE) & Shop Safety Sign-Off\n`;

  await fetch(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(documentId)}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: bodyText
          }
        }
      ]
    })
  }).catch(() => {});

  const url = `https://docs.google.com/document/d/${documentId}/edit`;
  await logWorkspaceActivity('docs', 'create_document', documentId, title, url);
  return { documentId, title: doc.title || title, documentUrl: url };
}

// --- 2. Google Tasks API (tasks.googleapis.com) ---
export async function listGoogleTasks(tasklistId = '@default') {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view your Google Tasks.');

  const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists?maxResults=10', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!listsRes.ok) {
    const err = await listsRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to load Google Task Lists (HTTP ${listsRes.status})`);
  }

  const listsData = await listsRes.json();
  const taskLists = listsData.items || [];
  const targetListId = tasklistId === '@default' && taskLists[0]?.id ? taskLists[0].id : tasklistId;

  const tasksRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(targetListId)}/tasks?maxResults=20`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const tasksData = tasksRes.ok ? await tasksRes.json().catch(() => ({})) : {};
  return {
    taskLists,
    activeListId: targetListId,
    tasks: tasksData.items || []
  };
}

export async function createTraineeOnboardingTask({
  title = 'Complete Valley Career Center WIOA Eligibility & OSHA-10 Check-In',
  notes = 'Bring government ID to Springboards Community Center (2269 15th Ave. S.W., Lanett, AL 36863) and verify WIOA Activity 220 referral.',
  tasklistId = '@default'
} = {}) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to create a task.');

  const confirmed = window.confirm(
    `Create new Google Task "${title}" in your Tasks checklist?`
  );
  if (!confirmed) return null;

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(tasklistId)}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      notes,
      status: 'needsAction'
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Task (HTTP ${res.status})`);
  }

  const created = await res.json();
  await logWorkspaceActivity('tasks', 'create_task', created.id, created.title, 'https://tasks.google.com');
  return created;
}

// --- 3. Google Keep API (keep.googleapis.com) ---
export async function listKeepNotes() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to access Google Keep.');

  const res = await fetch('https://keep.googleapis.com/v1/notes?pageSize=15', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMsg = err.error?.message || `HTTP ${res.status}`;
    return {
      notes: [],
      enterpriseNote: true,
      errorMessage:
        `Google Keep API (keep.googleapis.com) is an enterprise-only Workspace API requiring a Google Workspace Enterprise domain with domain-wide delegation enabled in Admin Console (consumer @gmail.com accounts cannot authorize Keep scopes via standard popup OAuth). API response: ${rawMsg}`
    };
  }

  const data = await res.json();
  return { notes: data.notes || [], enterpriseNote: false };
}

export async function createKeepSafetyNote({
  title = 'Springboards Shop Bay Safety & Tool Inventory Note',
  text = 'Verify table saw blade guards, PPE hard hats, safety glasses, and electrical multimeter leads before 8:00 AM cohort start.'
} = {}) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to create a Keep note.');

  const confirmed = window.confirm(
    `Create a new Google Keep note "${title}"?`
  );
  if (!confirmed) return null;

  const res = await fetch('https://keep.googleapis.com/v1/notes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      body: {
        text: { text }
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
      'Google Keep API requires a Google Workspace Enterprise account with domain-wide delegation enabled.'
    );
  }

  const created = await res.json();
  await logWorkspaceActivity('keep', 'create_note', created.name, title, 'https://keep.google.com');
  return created;
}

// --- 4. Google Contacts / People API (people.googleapis.com) ---
export async function listGoogleContacts() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view your Contacts.');

  const [meRes, connRes] = await Promise.all([
    fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers,organizations', {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => null),
    fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=15', {
      headers: { Authorization: `Bearer ${token}` }
    })
  ]);

  if (!connRes.ok) {
    const err = await connRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to load Google Contacts (HTTP ${connRes.status})`);
  }

  const meData = meRes && meRes.ok ? await meRes.json().catch(() => ({})) : {};
  const connData = await connRes.json();
  return {
    profile: meData,
    connections: connData.connections || []
  };
}

export async function createSpringboardsContact({
  givenName = 'Marvin',
  familyName = 'Thompson (Springboards Advisor)',
  email = 'info@springboardsfcd.org',
  phone = '615-603-1157',
  organization = 'Springboards for Community Development',
  jobTitle = 'Founder & Executive Director — Trade Training & WIOA Pathways'
} = {}) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to save a contact.');

  const confirmed = window.confirm(
    `Save contact "${givenName} ${familyName}" (${email} • ${phone}) to your Google Contacts?`
  );
  if (!confirmed) return null;

  const res = await fetch('https://people.googleapis.com/v1/people:createContact?personFields=names,emailAddresses,phoneNumbers,organizations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      names: [{ givenName, familyName }],
      emailAddresses: [{ value: email, type: 'work' }],
      phoneNumbers: [{ value: phone, type: 'work' }],
      organizations: [{ name: organization, title: jobTitle }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Contact (HTTP ${res.status})`);
  }

  const created = await res.json();
  await logWorkspaceActivity('contacts', 'create_contact', created.resourceName, `${givenName} ${familyName}`, 'https://contacts.google.com');
  return created;
}

// --- 5. Google Slides API (slides.googleapis.com & drive.googleapis.com) ---
export async function listGoogleSlides() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view your Google Slides presentations.');

  const q = encodeURIComponent("mimeType='application/vnd.google-apps.presentation' and trashed=false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=10&fields=files(id,name,webViewLink,modifiedTime)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list Google Slides (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function getSlidePresentation(presentationId) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view presentation details.');

  const res = await fetch(`https://slides.googleapis.com/v1/presentations/${encodeURIComponent(presentationId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to load presentation (HTTP ${res.status})`);
  }

  return await res.json();
}

export async function createSafetyOrientationDeck(title = 'Springboards OSHA-10 & NCCER Cohort Orientation Deck') {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to create a Google Slides presentation.');

  const confirmed = window.confirm(
    `Create a new Google Slides presentation "${title}" in your Google Drive?`
  );
  if (!confirmed) return null;

  const res = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Slides deck (HTTP ${res.status})`);
  }

  const deck = await res.json();
  const presentationId = deck.presentationId;
  const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;
  await logWorkspaceActivity('slides', 'create_presentation', presentationId, title, url);
  return {
    presentationId,
    title: deck.title || title,
    slidesCount: (deck.slides || []).length,
    presentationUrl: url
  };
}

// --- 6. Google Chat API (chat.googleapis.com) ---
export async function listChatSpaces() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to view your Google Chat spaces.');

  const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=15', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMsg = err.error?.message || `HTTP ${res.status}`;
    return {
      spaces: [],
      configRequired: true,
      consoleUrl: `https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=${firebaseConfig.projectId}`,
      errorMessage: rawMsg
    };
  }

  const data = await res.json();
  return {
    spaces: data.spaces || [],
    configRequired: false,
    consoleUrl: `https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=${firebaseConfig.projectId}`
  };
}

export async function sendChatCohortMessage(spaceName, text = 'Springboards Trade Cohort Reminder: Shop safety briefing begins at 8:00 AM sharp at 2269 15th Ave. S.W., Lanett, AL.') {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to send a Google Chat message.');
  if (!spaceName) throw new Error('Please select a Google Chat space first.');

  const confirmed = window.confirm(
    `Send message to Google Chat space (${spaceName})?\n\n"${text}"`
  );
  if (!confirmed) return null;

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to send Google Chat message (HTTP ${res.status})`);
  }

  const msg = await res.json();
  await logWorkspaceActivity('chat', 'send_message', msg.name, spaceName, 'https://mail.google.com/chat');
  return msg;
}

// --- 7. Google Meet API (meet.googleapis.com) ---
export async function createMeetIntakeSpace() {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google first to create a Google Meet room.');

  const confirmed = window.confirm(
    'Create a new Google Meet virtual room for Springboards Advisor Intake & Cohort Orientation?'
  );
  if (!confirmed) return null;

  const res = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Meet space (HTTP ${res.status})`);
  }

  const space = await res.json();
  await logWorkspaceActivity('meet', 'create_space', space.name, space.meetingCode || 'Meet Space', space.meetingUri || '');
  return space;
}

export async function getMeetSpace(spaceName) {
  const token = getCachedToken();
  if (!token) throw new Error('Please sign in with Google to inspect a Google Meet space.');

  const res = await fetch(`https://meet.googleapis.com/v2/${spaceName}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Google Meet space (HTTP ${res.status})`);
  }

  return await res.json();
}

// Global window attachment for non-module scripts
window.SpringboardsWorkspace = {
  SCOPES,
  signInWithGoogle,
  signOutFromGoogle,
  getCachedToken,
  getCurrentUser,
  isConnected,
  subscribeWorkspaceAuth,
  syncAuthenticatedUserToCloudSql,
  logWorkspaceActivity,
  listClassroomCourses,
  getClassroomCourseDetails,
  createSpringboardsClassroomCourse,
  postClassroomAnnouncement,
  createClassroomAssignment,
  createMasterSpreadsheet,
  appendCandidateToSheet,
  appendAttendanceToSheet,
  syncAllCandidatesToSheet,
  testSpreadsheetAccess,
  getSpreadsheetConfig,
  saveSpreadsheetConfig,
  listGoogleDocs,
  getGoogleDoc,
  createTrainingManualDoc,
  listGoogleTasks,
  createTraineeOnboardingTask,
  listKeepNotes,
  createKeepSafetyNote,
  listGoogleContacts,
  createSpringboardsContact,
  listGoogleSlides,
  getSlidePresentation,
  createSafetyOrientationDeck,
  listChatSpaces,
  sendChatCohortMessage,
  createMeetIntakeSpace,
  getMeetSpace
};
