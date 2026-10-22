import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { MATRIC_SUBJECTS } from '../../core/data/subjects';

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

  readonly subjects = MATRIC_SUBJECTS;

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
