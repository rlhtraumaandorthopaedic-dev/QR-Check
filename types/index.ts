// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  department?: string;
  createdAt: Date;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  eventName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  location?: string;
  status: 'checked-in' | 'checked-out';
}

export interface AttendanceEvent {
  id: string;
  name: string;
  description?: string;
  location: string;
  startTime: Date;
  endTime: Date;
  qrCode: string;
  createdBy: string;
  isActive: boolean;
}

// Training types
export interface TrainingModule {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  qrCode: string;
  contentUrl?: string;
  requiredScore?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  moduleName: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  timeSpent?: number; // minutes
}

// Participation types
export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  qrCode: string;
  points?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ParticipationRecord {
  id: string;
  userId: string;
  userName: string;
  activityId: string;
  activityName: string;
  timestamp: Date;
  points?: number;
}

// Competency types
export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  qrCode: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CompetencyRecord {
  id: string;
  userId: string;
  userName: string;
  competencyId: string;
  competencyName: string;
  assessorId: string;
  assessorName: string;
  status: 'achieved' | 'in-progress' | 'needs-improvement';
  assessmentDate: Date;
  notes?: string;
  evidenceUrl?: string;
}

// QR Code types
export interface QRCodeData {
  type: 'attendance' | 'training' | 'participation' | 'competency';
  id: string;
  name: string;
  timestamp: number;
  validUntil?: number;
  token: string; // for validation
}
