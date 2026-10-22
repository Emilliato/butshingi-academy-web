import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './academics.html',
  styleUrl: './academics.scss',
})
export class AcademicsComponent implements OnInit {
  private seo = inject(SeoService);

  readonly phases = [
    { name: 'Matric Rewrite', grades: 'Grade 12', copy: 'A second chance at Matric: rewrite your NSC subjects with focused tuition, exam preparation and university/TVET and career guidance.' },
  ];

  readonly subjects = [
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

  readonly supports = [
    { title: 'Extra lessons', copy: 'After-hours and weekend sessions in core subjects for learners who need extra time.' },
    { title: 'Remedial support', copy: 'One-on-one and small-group catch-up support identified through regular assessment.' },
    { title: 'Exam preparation', copy: 'Structured revision programmes ahead of terminal and Matric exams.' },
    { title: 'Reading programmes', copy: 'Guided reading and library access to build confidence and comprehension.' },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'Academics',
      description:
        'S. Butshingi Academy offers Matric rewrite in all NSC subjects, including Mathematics, Physical Sciences, Life Sciences, Accounting and more, with academic support.',
      path: '/academics',
    });
  }
}
