export interface TeamMember {
  initials: string;
  name: string;
  role: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { initials: 'KB', name: 'Khanya Butshingi', role: 'Project Manager' },
  { initials: 'VN', name: 'Vuyisa Ntshinka', role: 'Financial Officer' },
  { initials: 'NM', name: 'Nontyatyambo Mkalali', role: 'Director' },
  { initials: 'AM', name: 'Asazama Makhwenkwe', role: 'Academic Lead' },
  { initials: 'VM', name: 'Vuyolwethu Manqeyi', role: 'Director' },
  { initials: 'SH', name: 'Sithandiwe Hlayo', role: 'Monitoring & Evaluation Lead' },
];
