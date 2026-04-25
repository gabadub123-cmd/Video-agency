export type SpecShootStatus = 'Concept' | 'Pre-Prod' | 'Filming' | 'Editing' | 'Done';

export interface SpecShoot {
  id: string;
  created_at: string;
  title: string;
  status: SpecShootStatus;
  shoot_date: string | null;
  notes: string | null;
  thumbnail_url: string | null;
}

export type OutreachStatus = 'Lead' | 'Contacted' | 'In Talks' | 'Signed';

export interface CompanyOutreach {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: OutreachStatus;
  notes: string | null;
  industry: string | null;
}
