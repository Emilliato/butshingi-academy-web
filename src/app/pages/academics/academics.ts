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
    { name: 'Foundation Phase', grades: 'Grade R – 3', copy: 'Early literacy and numeracy, play-based learning and school-readiness support.' },
    { name: 'Intermediate Phase', grades: 'Grade 4 – 6', copy: 'Building strong reading, writing and maths foundations with structured academic support.' },
    { name: 'Senior Phase', grades: 'Grade 7 – 9', copy: 'Subject choice guidance, exam preparation and the start of career-focused life skills.' },
    { name: 'FET / Matric Prep', grades: 'Grade 10 – 12', copy: 'Exam prep, extra lessons and university/TVET and career guidance for Matric success.' },
  ];

  readonly subjects = [
    { icon: '🔤', title: 'Literacy & Language', copy: 'Home language, English and reading programmes with dedicated library time.' },
    { icon: '➗', title: 'Mathematics & Numeracy', copy: 'Structured maths support from foundation counting through to Matric-level problem solving.' },
    { icon: '💻', title: 'Digital & ICT Skills', copy: 'Computer literacy, basic coding concepts and access to our digital learning lab.' },
    { icon: '🌱', title: 'Life Skills & Leadership', copy: 'Leadership, financial literacy, career guidance and personal development.' },
    { icon: '🎨', title: 'Creative Arts', copy: 'Music, art and performance opportunities woven into the weekly programme.' },
    { icon: '⚽', title: 'Sport & Wellbeing', copy: 'Football and physical development that builds discipline, teamwork and belonging.' },
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
        'Explore the phases, subjects and academic support programmes offered at S. Butshingi Academy, from Foundation Phase through to Matric preparation.',
      path: '/academics',
    });
  }
}
