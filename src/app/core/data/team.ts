export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    initials: 'KB',
    name: 'Khanya Butshingi',
    role: 'Project Manager',
    bio: 'Leads day-to-day operations and keeps every programme accountable to the families we serve.',
  },
  {
    initials: 'VN',
    name: 'Vuyisa Ntshinka',
    role: 'Financial Officer',
    bio: "Manages the Academy's finances and makes sure every rand is tracked and put to good use.",
  },
  {
    initials: 'NM',
    name: 'Nontyatyambo Mkalali',
    role: 'Director',
    bio: 'Provides strategic oversight and represents the Academy within the wider community.',
  },
  {
    initials: 'AM',
    name: 'Asazama Makhwenkwe',
    role: 'Academic Lead',
    bio: 'Oversees curriculum delivery and academic support across every grade.',
  },
  {
    initials: 'VM',
    name: 'Vuyolwethu Manqeyi',
    role: 'Director',
    bio: "Champions partnerships and community engagement to grow the Academy's reach.",
  },
  {
    initials: 'SH',
    name: 'Sithandiwe Hlayo',
    role: 'Monitoring & Evaluation Lead',
    bio: 'Tracks programme impact and reports outcomes back to donors and partners.',
  },
];
