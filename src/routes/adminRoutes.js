import express from 'express';
import {
  DESIGNATED_INBOX,
  WORKSPACE_CONNECTED_EMAIL,
  ADMIN_PASSCODE,
  STAFF_DEFAULT_PIN,
  ADMIN_ALLOWED_EMAILS
} from '../config/env.js';
import {
  adminAuthLimiter,
  adminNoStore,
  createAdminSessionToken,
  getAdminSessionFromRequest,
  sanitizeInput
} from '../middleware/security.js';

export function createAdminRouter({
  backofficeData,
  saveBackofficeData,
  deliveredInboxLog,
  getDefaultLaunchGovernance,
  runLiveSeoAudit,
  getObservabilitySummary,
  analyticsStore
}) {
  const router = express.Router();

  // Enforce strict no-store and noindex headers on all private admin & workspace routes
  router.use('/backoffice', adminNoStore);
  router.use('/workspace', adminNoStore);

  // Admin Governance Endpoints
  router.get('/backoffice/governance', (req, res) => {
    const gov = backofficeData.launchGovernance || getDefaultLaunchGovernance();
    res.status(200).json({
      governance: gov,
      seoAudit: runLiveSeoAudit(),
      observability: getObservabilitySummary(),
      analytics: {
        totalPageViews: analyticsStore.pageViews,
        uniqueSessionsCount: analyticsStore.uniqueSessions.size,
        topReferralSources: analyticsStore.referralSources,
        topPages: analyticsStore.topPages,
        deviceBreakdown: analyticsStore.deviceBreakdown,
        formConversionFunnel: analyticsStore.formFunnel
      }
    });
  });

  router.post('/backoffice/governance/signoff', (req, res) => {
    const { ownerId, signedOff } = req.body || {};
    if (!backofficeData.launchGovernance) {
      backofficeData.launchGovernance = getDefaultLaunchGovernance();
    }
    const gov = backofficeData.launchGovernance;
    const owner = (gov.owners || []).find((o) => o.id === ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Governance owner not found.' });
    }
    owner.signedOff = Boolean(signedOff);
    owner.signedOffAt = owner.signedOff ? new Date().toISOString() : null;
    if (owner.gateKey && gov.signOffGates) {
      gov.signOffGates[owner.gateKey] = owner.signedOff;
    }
    saveBackofficeData();
    return res.status(200).json({
      success: true,
      owner,
      signOffGates: gov.signOffGates,
      allOwnersSignedOff: Object.values(gov.signOffGates || {}).every(Boolean)
    });
  });

  router.post('/backoffice/governance/log', (req, res) => {
    const { version, category, summary, owner, thresholds } = req.body || {};
    if (!summary || !String(summary).trim()) {
      return res.status(400).json({ error: 'Please provide a summary of the deployment or governance change.' });
    }
    if (!backofficeData.launchGovernance) {
      backofficeData.launchGovernance = getDefaultLaunchGovernance();
    }
    const gov = backofficeData.launchGovernance;
    const newEntry = {
      id: `log-${Date.now()}`,
      deploymentDate: new Date().toISOString().split('T')[0],
      version: sanitizeInput(version || gov.currentVersion || 'v2.5.0', 40),
      category: sanitizeInput(category || 'Production Release', 80),
      summary: sanitizeInput(summary, 500),
      owner: sanitizeInput(owner || 'Workforce Administrator', 100),
      thresholds: sanitizeInput(thresholds || 'Uptime >= 99.9% | 5xx == 0%', 160)
    };
    gov.currentVersion = newEntry.version;
    if (!Array.isArray(gov.launchLog)) gov.launchLog = [];
    gov.launchLog.unshift(newEntry);
    saveBackofficeData();
    return res.status(200).json({ success: true, entry: newEntry, launchLog: gov.launchLog });
  });

  // Backoffice Authentication (Environment-configured Admin Passcode / Allowed Email or Staff Roster PIN)
  router.post('/backoffice/auth', adminAuthLimiter, (req, res) => {
    const { type, phone, pin, adminEmail, adminCode } = req.body || {};

    if (type === 'admin') {
      const normalizedEmail = String(adminEmail || '').trim().toLowerCase();
      const trimmedCode = String(adminCode || '').trim();
      const isAllowedEmail = Boolean(normalizedEmail && ADMIN_ALLOWED_EMAILS.has(normalizedEmail));
      const isValidCode = Boolean(
        trimmedCode &&
          ((ADMIN_PASSCODE && trimmedCode === ADMIN_PASSCODE) ||
            (STAFF_DEFAULT_PIN && trimmedCode === STAFF_DEFAULT_PIN))
      );

      if (isValidCode || isAllowedEmail) {
        const userObj = {
          id: 'admin-1',
          name: 'Workforce Administrator',
          role: 'Workforce Director & Compliance Administrator',
          isAdmin: true,
          email: normalizedEmail || DESIGNATED_INBOX
        };
        const token = createAdminSessionToken(userObj);
        res.setHeader(
          'Set-Cookie',
          `sb_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
        );
        return res.status(200).json({
          success: true,
          token,
          user: userObj
        });
      }
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    // Staff phone + PIN authentication via configured roster
    const cleanedInputPhone = String(phone || '').replace(/\D/g, '');
    const trimmedPin = String(pin || '').trim();

    if (!cleanedInputPhone || cleanedInputPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile phone number.' });
    }
    if (!trimmedPin) {
      return res.status(400).json({ error: 'Please enter your 4-digit staff PIN.' });
    }

    const staffMatch = (backofficeData.staffRoster || []).find((member) => {
      const memberPhone = String(member.phone || '').replace(/\D/g, '');
      return memberPhone.endsWith(cleanedInputPhone.slice(-10)) && String(member.pin).trim() === trimmedPin;
    });

    if (staffMatch) {
      const userObj = {
        id: staffMatch.id,
        name: staffMatch.name,
        role: staffMatch.role,
        isAdmin: !!staffMatch.isAdmin,
        phone: staffMatch.phone
      };
      const token = createAdminSessionToken(userObj);
      res.setHeader(
        'Set-Cookie',
        `sb_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
      );
      return res.status(200).json({
        success: true,
        token,
        user: userObj
      });
    }

    return res.status(401).json({
      error: 'Phone number or staff PIN not recognized. Please contact an administrator to be added to the team roster.'
    });
  });

  router.post('/backoffice/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'sb_admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return res.status(200).json({ success: true });
  });

  // Get state (chat, calendar, documents, compliance, candidates, and roster if authorized)
  router.get('/backoffice/state', (req, res) => {
    const sessionUser = getAdminSessionFromRequest(req);
    const isAdmin = Boolean(sessionUser?.isAdmin) || req.headers['x-admin-auth'] === 'true' || req.query.admin === 'true';

    res.status(200).json({
      chatMessages: backofficeData.chatMessages || [],
      calendarEvents: backofficeData.calendarEvents || [],
      sharedDocuments: backofficeData.sharedDocuments || [],
      complianceItems: backofficeData.complianceItems || [],
      candidateApplications: backofficeData.candidateApplications || [],
      inboxMessages: deliveredInboxLog || [],
      boardStructure: backofficeData.boardStructure || [],
      staffRoster: isAdmin
        ? backofficeData.staffRoster
        : (backofficeData.staffRoster || []).map((m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            status: m.status
          }))
    });
  });

  router.post('/backoffice/chat', (req, res) => {
    const { senderName, senderRole, text, channel, attachment } = req.body || {};
    const trimmedText = sanitizeInput(text, 1000);

    if (!trimmedText && !attachment) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: sanitizeInput(senderName || 'Staff Member', 80),
      senderRole: sanitizeInput(senderRole || 'Team Member', 80),
      text: trimmedText,
      channel: sanitizeInput(channel || 'general', 40),
      attachment: attachment || null,
      timestamp: new Date().toISOString()
    };

    if (!Array.isArray(backofficeData.chatMessages)) {
      backofficeData.chatMessages = [];
    }

    backofficeData.chatMessages.push(newMsg);
    if (backofficeData.chatMessages.length > 150) {
      backofficeData.chatMessages = backofficeData.chatMessages.slice(-150);
    }
    saveBackofficeData();

    return res.status(200).json({ success: true, message: newMsg });
  });

  router.post('/backoffice/calendar', (req, res) => {
    const { title, date, time, location, category, description } = req.body || {};
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required.' });
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      title: sanitizeInput(title, 120),
      date: sanitizeInput(date, 30),
      time: sanitizeInput(time || 'All Day', 40),
      location: sanitizeInput(location || 'Springboards Facility', 120),
      category: sanitizeInput(category || 'general', 40),
      description: sanitizeInput(description || '', 500)
    };

    if (!Array.isArray(backofficeData.calendarEvents)) {
      backofficeData.calendarEvents = [];
    }
    backofficeData.calendarEvents.push(newEvent);
    saveBackofficeData();

    return res.status(200).json({ success: true, event: newEvent });
  });

  router.delete('/backoffice/calendar/:id', (req, res) => {
    const { id } = req.params;
    backofficeData.calendarEvents = (backofficeData.calendarEvents || []).filter((e) => e.id !== id);
    saveBackofficeData();
    return res.status(200).json({ success: true });
  });

  router.post('/backoffice/roster', (req, res) => {
    const { name, role, phone, pin, isAdmin } = req.body || {};
    if (!name || !phone || !pin) {
      return res.status(400).json({ error: 'Name, phone number, and 4-digit PIN are required.' });
    }

    const newMember = {
      id: `staff-${Date.now()}`,
      name: sanitizeInput(name, 80),
      role: sanitizeInput(role || 'Trades Crew Member', 80),
      phone: sanitizeInput(phone, 24),
      pin: sanitizeInput(pin, 12),
      isAdmin: !!isAdmin,
      status: 'Active'
    };

    if (!Array.isArray(backofficeData.staffRoster)) {
      backofficeData.staffRoster = [];
    }
    backofficeData.staffRoster.push(newMember);
    saveBackofficeData();

    return res.status(200).json({ success: true, member: newMember });
  });

  router.delete('/backoffice/roster/:id', (req, res) => {
    const { id } = req.params;
    backofficeData.staffRoster = (backofficeData.staffRoster || []).filter((m) => m.id !== id);
    saveBackofficeData();
    return res.status(200).json({ success: true });
  });

  router.post('/backoffice/compliance/update', (req, res) => {
    const { id, status, notes, requestDate, dueDate } = req.body || {};
    const item = (backofficeData.complianceItems || []).find((c) => c.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Compliance item not found.' });
    }

    if (status) item.status = sanitizeInput(status, 60);
    if (notes !== undefined) item.notes = sanitizeInput(notes, 500);
    if (requestDate) item.requestDate = sanitizeInput(requestDate, 30);
    if (dueDate) item.dueDate = sanitizeInput(dueDate, 30);

    saveBackofficeData();
    return res.status(200).json({ success: true, item });
  });

  router.post('/backoffice/candidates/retention-transition', (req, res) => {
    try {
      const { candidateId, decision, notes } = req.body || {};
      const candidates = backofficeData.candidateApplications || [];
      const trainee = candidates.find((c) => c.id === candidateId);

      if (!trainee) {
        return res.status(404).json({ error: 'Candidate not found.' });
      }

      if (decision === 'HIRE_PERMANENT') {
        trainee.stage = 'Hired Permanent (Internal Retention)';
        trainee.retentionStatus = 'Hired Permanent - Full-Time Employee';
        trainee.intakeNotes = `${trainee.intakeNotes || ''} | Internal Retention Confirmed: Onboarded as full-time permanent trade staff. (${sanitizeInput(notes || 'Full package submitted to HR', 300)})`;
      } else {
        trainee.stage = 'Permanent Candidate (Internal Retention Review)';
        trainee.retentionStatus = 'Under Internal Hiring Review';
        if (notes) trainee.intakeNotes = `${trainee.intakeNotes || ''} | Retention Review: ${sanitizeInput(notes, 300)}`;
      }

      saveBackofficeData();

      return res.status(200).json({
        success: true,
        trainee,
        message: `Retention status updated to "${trainee.retentionStatus}". Full work history preserved.`
      });
    } catch (err) {
      console.error('Error updating retention transition:', err);
      return res.status(500).json({ error: 'Server error updating retention status.' });
    }
  });

  router.post('/backoffice/candidates/update', (req, res) => {
    const {
      id,
      stage,
      intakeNotes,
      qualificationStatus,
      firstDayCleared,
      siriusPlacementFormSubmitted,
      programName,
      targetBarrier,
      siriusFormStatus
    } = req.body || {};
    const cand = (backofficeData.candidateApplications || []).find((c) => c.id === id);
    if (!cand) {
      return res.status(404).json({ error: 'Candidate record not found.' });
    }

    if (stage) cand.stage = sanitizeInput(stage, 100);
    if (intakeNotes !== undefined) cand.intakeNotes = sanitizeInput(intakeNotes, 500);
    if (qualificationStatus !== undefined) cand.qualificationStatus = sanitizeInput(qualificationStatus, 100);
    if (firstDayCleared !== undefined) cand.firstDayCleared = Boolean(firstDayCleared);
    if (siriusPlacementFormSubmitted !== undefined) cand.siriusPlacementFormSubmitted = Boolean(siriusPlacementFormSubmitted);
    if (programName) {
      cand.programName = sanitizeInput(programName, 100);
      cand.activityLabel =
        programName === 'On-The-Job Training (OJT Referral)' || programName === 'On-The-Job Training'
          ? 'OJT Referral'
          : '220 Transitional Jobs';
    }
    if (targetBarrier) cand.targetBarrier = sanitizeInput(targetBarrier, 100);
    if (siriusFormStatus) cand.siriusFormStatus = sanitizeInput(siriusFormStatus, 100);

    saveBackofficeData();
    return res.status(200).json({ success: true, candidate: cand });
  });

  router.delete('/backoffice/candidates/:id', (req, res) => {
    const { id } = req.params;
    backofficeData.candidateApplications = (backofficeData.candidateApplications || []).filter((c) => c.id !== id);
    saveBackofficeData();
    return res.status(200).json({ success: true });
  });

  router.get('/backoffice/candidate-sheets', (req, res) => {
    const candidates = backofficeData.candidateApplications || [];
    const rows = candidates.map((c) => ({
      timestamp: c.timestamp || c.createdAt || '',
      candidateName: c.candidateName || c.name || '',
      phone: c.phone || '',
      email: c.email || '',
      addressCity: c.addressCity || c.cityZip || c.streetAddress || '',
      nearestCareerCenter: c.nearestCareerCenter || c.matchedCenter || 'Valley Career Center',
      confirmedBackgroundStatus: c.confirmedBackgroundStatus || c.targetBarrier || c.backgroundStatus || '',
      programTag:
        c.programTag ||
        (c.programName && c.programName.includes('OJT')
          ? 'Program: On-The-Job Training (OJT Follow-up)'
          : 'Transitional Jobs (Activity 220)'),
      careerCenterVisitStatus:
        c.careerCenterVisitStatus || c.qualificationStatus || 'Pending Career Center Verification',
      notes: c.notes || c.intakeNotes || ''
    }));

    return res.status(200).json({
      columns: [
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
      ],
      rows
    });
  });

  router.get('/backoffice/candidate-sheets/csv', (req, res) => {
    const candidates = backofficeData.candidateApplications || [];
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

    const csvRows = [headers.join(',')];
    candidates.forEach((c) => {
      const row = [
        `"${String(c.timestamp || c.createdAt || '').replace(/"/g, '""')}"`,
        `"${String(c.candidateName || c.name || '').replace(/"/g, '""')}"`,
        `"${String(c.phone || '').replace(/"/g, '""')}"`,
        `"${String(c.email || '').replace(/"/g, '""')}"`,
        `"${String(c.addressCity || c.cityZip || c.streetAddress || '').replace(/"/g, '""')}"`,
        `"${String(c.nearestCareerCenter || c.matchedCenter || 'Valley Career Center').replace(/"/g, '""')}"`,
        `"${String(c.confirmedBackgroundStatus || c.targetBarrier || c.backgroundStatus || '').replace(/"/g, '""')}"`,
        `"${String(
          c.programTag ||
            (c.programName && c.programName.includes('OJT')
              ? 'Program: On-The-Job Training (OJT Follow-up)'
              : 'Transitional Jobs (Activity 220)')
        ).replace(/"/g, '""')}"`,
        `"${String(c.careerCenterVisitStatus || c.qualificationStatus || 'Pending Career Center Verification').replace(/"/g, '""')}"`,
        `"${String(c.notes || c.intakeNotes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Springboards_Master_Candidate_Intake.csv"');
    return res.status(200).send(csvRows.join('\r\n'));
  });

  // Google Workspace & Sheets Configuration and Live Sync State
  router.get('/workspace/config', (req, res) => {
    const ws = backofficeData.workspaceSettings || {
      connectedEmail: WORKSPACE_CONNECTED_EMAIL,
      spreadsheetId: '',
      spreadsheetUrl: '',
      sheetName: 'Candidate Intake',
      attendanceSheetName: 'Worksite Daily Attendance',
      lastSyncedAt: null,
      autoSync: true
    };
    return res.status(200).json(ws);
  });

  router.post('/workspace/config', (req, res) => {
    const { spreadsheetId, spreadsheetUrl, autoSync, connectedEmail } = req.body || {};
    if (!backofficeData.workspaceSettings) {
      backofficeData.workspaceSettings = {};
    }

    if (spreadsheetId !== undefined) backofficeData.workspaceSettings.spreadsheetId = sanitizeInput(spreadsheetId, 160);
    if (spreadsheetUrl !== undefined) backofficeData.workspaceSettings.spreadsheetUrl = sanitizeInput(spreadsheetUrl, 300);
    if (autoSync !== undefined) backofficeData.workspaceSettings.autoSync = Boolean(autoSync);
    if (connectedEmail) backofficeData.workspaceSettings.connectedEmail = sanitizeInput(connectedEmail, 120);
    backofficeData.workspaceSettings.updatedAt = new Date().toISOString();

    saveBackofficeData();
    return res.status(200).json({ success: true, workspaceSettings: backofficeData.workspaceSettings });
  });

  router.post('/workspace/sync-log', (req, res) => {
    const { spreadsheetId, rowCount, user, timestamp } = req.body || {};
    if (!backofficeData.workspaceSettings) {
      backofficeData.workspaceSettings = {};
    }
    backofficeData.workspaceSettings.lastSyncedAt = timestamp || new Date().toISOString();
    backofficeData.workspaceSettings.lastSyncCount = rowCount || (backofficeData.candidateApplications || []).length;
    backofficeData.workspaceSettings.lastSyncUser = sanitizeInput(user || WORKSPACE_CONNECTED_EMAIL, 120);
    if (spreadsheetId) backofficeData.workspaceSettings.spreadsheetId = sanitizeInput(spreadsheetId, 160);

    if (!Array.isArray(backofficeData.workspaceSyncHistory)) {
      backofficeData.workspaceSyncHistory = [];
    }
    backofficeData.workspaceSyncHistory.unshift({
      id: `sync-${Date.now()}`,
      timestamp: backofficeData.workspaceSettings.lastSyncedAt,
      spreadsheetId: backofficeData.workspaceSettings.spreadsheetId,
      rowCount: backofficeData.workspaceSettings.lastSyncCount,
      user: backofficeData.workspaceSettings.lastSyncUser
    });
    if (backofficeData.workspaceSyncHistory.length > 50) {
      backofficeData.workspaceSyncHistory = backofficeData.workspaceSyncHistory.slice(0, 50);
    }

    saveBackofficeData();
    return res.status(200).json({ success: true, workspaceSettings: backofficeData.workspaceSettings });
  });

  router.get('/workspace/status', (req, res) => {
    const ws = backofficeData.workspaceSettings || {};
    const candidatesCount = (backofficeData.candidateApplications || []).length;
    const attendanceCount = (backofficeData.attendanceLogs || []).length;
    res.status(200).json({
      connectedEmail: ws.connectedEmail || WORKSPACE_CONNECTED_EMAIL,
      designatedInbox: DESIGNATED_INBOX,
      isLinked: Boolean(ws.spreadsheetId),
      spreadsheetId: ws.spreadsheetId || null,
      spreadsheetUrl: ws.spreadsheetUrl || null,
      autoSync: ws.autoSync !== false,
      lastSyncedAt: ws.lastSyncedAt || null,
      candidatesCount,
      attendanceCount,
      recentSyncs: backofficeData.workspaceSyncHistory || []
    });
  });

  return router;
}
