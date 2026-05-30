export type Tier = 'aday' | 'uzman' | 'ustat'
export type PsyStatus = 'pending' | 'active' | 'suspended'
export type ApptStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type MentorshipStatus = 'pending' | 'active' | 'completed' | 'declined'
export type MembershipStatus = 'active' | 'inactive' | 'past_due' | 'cancelled'
export type SessionType = 'online' | 'yuz_yuze'

// ── Column-only types (for Insert/Update) ──
interface ProfileColumns {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  city: string | null
  linkedin: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface PsychologistColumns {
  id: string
  university: string | null
  department: string | null
  grad_year: number | null
  exp_years: number
  approach: string | null
  bio: string | null
  session_types: SessionType[]
  weekly_capacity: string | null
  mentor_pref: string | null
  tier: Tier
  status: PsyStatus
  is_online: boolean
  mentor_id: string | null
  created_at: string
  updated_at: string
}

interface ClientColumns {
  id: string
  psychologist_id: string | null
  name: string
  email: string | null
  phone: string | null
  status: 'active' | 'passive' | 'ended'
  session_count: number
  notes: string | null
  created_at: string
  updated_at: string
}

interface AppointmentColumns {
  id: string
  psychologist_id: string
  client_id: string
  scheduled_at: string
  duration_minutes: number
  session_type: SessionType | null
  status: ApptStatus
  psy_notes: string | null
  created_at: string
  updated_at: string
}

interface AppointmentRequestColumns {
  id: string
  psychologist_id: string
  client_name: string
  client_email: string
  session_type: SessionType | null
  preferred_dates: { date: string; time: string }[] | null
  note: string | null
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

interface MentorshipColumns {
  id: string
  mentor_id: string
  mentee_id: string
  status: MentorshipStatus
  progress_pct: number
  notes: string | null
  started_at: string | null
  ended_at: string | null
  created_at: string
}

interface MembershipColumns {
  id: string
  psychologist_id: string
  tier: Tier
  status: MembershipStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// ── Row types (with optional joins for SELECT results) ──
export interface Profile extends ProfileColumns {}
export interface Psychologist extends PsychologistColumns {
  profiles?: Profile
  specializations?: Specialization[]
}
export interface Specialization { id: string; name: string }
export interface Client extends ClientColumns {}
export interface Appointment extends AppointmentColumns {
  clients?: Client
}
export interface AppointmentRequest extends AppointmentRequestColumns {}
export interface Mentorship extends MentorshipColumns {
  mentor?: Psychologist & { profiles: Profile }
  mentee?: Psychologist & { profiles: Profile }
}
export interface Membership extends MembershipColumns {}

// ── Supabase Database type (only column types, no join fields) ──
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row:    ProfileColumns
        Insert: Partial<ProfileColumns> & { id: string; email: string }
        Update: Partial<Omit<ProfileColumns, 'id' | 'created_at'>>
      }
      psychologists: {
        Row:    PsychologistColumns
        Insert: Partial<PsychologistColumns> & { id: string }
        Update: Partial<Omit<PsychologistColumns, 'id' | 'created_at'>>
      }
      specializations: {
        Row:    Specialization
        Insert: Partial<Specialization>
        Update: Partial<Specialization>
      }
      psychologist_specializations: {
        Row:    { psychologist_id: string; specialization_id: string }
        Insert: { psychologist_id: string; specialization_id: string }
        Update: never
      }
      clients: {
        Row:    ClientColumns
        Insert: Partial<ClientColumns> & { name: string }
        Update: Partial<Omit<ClientColumns, 'id' | 'created_at'>>
      }
      appointments: {
        Row:    AppointmentColumns
        Insert: Partial<AppointmentColumns> & { psychologist_id: string; client_id: string; scheduled_at: string }
        Update: Partial<Omit<AppointmentColumns, 'id' | 'psychologist_id' | 'client_id' | 'created_at'>>
      }
      appointment_requests: {
        Row:    AppointmentRequestColumns
        Insert: Partial<AppointmentRequestColumns> & { psychologist_id: string; client_name: string; client_email: string }
        Update: Partial<Pick<AppointmentRequestColumns, 'status'>>
      }
      mentorships: {
        Row:    MentorshipColumns
        Insert: Partial<MentorshipColumns> & { mentor_id: string; mentee_id: string }
        Update: Partial<Omit<MentorshipColumns, 'id' | 'mentor_id' | 'mentee_id' | 'created_at'>>
      }
      memberships: {
        Row:    MembershipColumns
        Insert: Partial<MembershipColumns> & { psychologist_id: string; tier: Tier }
        Update: Partial<Omit<MembershipColumns, 'id' | 'psychologist_id' | 'created_at'>>
      }
    }
  }
}
