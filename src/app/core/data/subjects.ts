export interface MatricSubject {
  icon: string;
  title: string;
  copy: string;
}

/** Matric rewrite subjects offered, as captured in the 2026 EduFees student list. */
export const MATRIC_SUBJECTS: MatricSubject[] = [
  { icon: '➗', title: 'Mathematics', copy: 'Full Matric Mathematics tuition with past-paper practice.' },
  { icon: '🔢', title: 'Mathematical Literacy', copy: 'Practical, real-world maths for the Matric rewrite.' },
  { icon: '⚗️', title: 'Physical Science', copy: 'Physics and Chemistry, from theory to exam technique.' },
  { icon: '🧬', title: 'Life Sciences', copy: 'Biology concepts, diagrams and exam-style questions.' },
  { icon: '🌾', title: 'Agricultural Science', copy: 'Crop, animal and soil science for the NSC exam.' },
  { icon: '🌍', title: 'Geography', copy: 'Physical and human geography, mapwork and GIS.' },
  { icon: '📜', title: 'History', copy: 'Source-based analysis and essay writing.' },
  { icon: '📊', title: 'Accounting', copy: 'Financial statements, ledgers and cost accounting.' },
  { icon: '💼', title: 'Business Studies', copy: 'Business environments, operations and ventures.' },
  { icon: '💹', title: 'Economics', copy: 'Micro and macroeconomics with exam practice.' },
  { icon: '🔤', title: 'English Home Language', copy: 'Literature, language structures and writing skills.' },
  { icon: '📖', title: 'English First Additional Language', copy: 'Reading, comprehension and writing for the NSC exam.' },
  { icon: '🗣️', title: 'isiXhosa First Additional Language', copy: 'Language, literature and writing in isiXhosa.' },
  { icon: '🌱', title: 'Life Orientation', copy: 'Life skills, careers and personal development.' },
];

export const REGISTRATION_FEE = 300;
export const FEE_PER_SUBJECT = 300;
