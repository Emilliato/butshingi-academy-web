import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { NewsService } from '../../core/services/news.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { TEAM_MEMBERS } from '../../core/data/team';
import { SHOW_LEADERSHIP_SECTION } from '../../core/config/feature-flags';

interface Pillar {
  icon: string;
  title: string;
  copy: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, RevealDirective, CountUpDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  news = inject(NewsService);

  readonly nextIntakeYear = new Date().getFullYear() + 1;
  readonly team = TEAM_MEMBERS;
  readonly showLeadership = SHOW_LEADERSHIP_SECTION;

  readonly stats = [
    { value: 81, suffix: '', label: 'Learners supported each year' },
    { value: 92, suffix: '%', label: 'Average academic performance' },
    { value: 100, suffix: '%', label: 'Attendance and retention' },
    { value: 9, suffix: '', label: 'Educators delivering the programme' },
  ];

  readonly pillars: Pillar[] = [
    { icon: '📚', title: 'All Matric subjects', copy: 'Rewrite any of 14 NSC subjects, from Mathematics and Sciences to Accounting, languages and Life Orientation.' },
    { icon: '📝', title: 'Exam preparation', copy: 'Past-paper practice, revision programmes and exam technique ahead of the NSC exams.' },
    { icon: '🧠', title: 'Academic support', copy: 'Extra lessons, remedial support and reading programmes for learners who need more time.' },
    { icon: '💻', title: 'Digital learning', copy: 'Computers, connectivity and digital platforms to study beyond the classroom.' },
    { icon: '🌱', title: 'Career guidance', copy: 'University, TVET and career guidance, plus life skills, leadership and financial literacy.' },
    { icon: '🏫', title: 'Resources & hostel', copy: 'Textbooks, workbooks and library materials, with optional boarding close to the Academy.' },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'S. Butshingi Academy — Mqonci, Eastern Cape',
      description:
        "A registered NPO in Mqonci, Chris Hani District offering Matric rewrite in all subjects, with exam preparation, academic support and career guidance.",
      path: '/',
    });

    this.seo.setJsonLd('ld-school', {
      '@context': 'https://schema.org',
      '@type': 'School',
      name: 'S. Butshingi Academy',
      description:
        'A registered NPO in Mqonci, Chris Hani District, Eastern Cape offering Matric rewrite in all subjects, with exam preparation and learner support.',
      url: 'https://sbutshingiacademy.co.za/',
      logo: 'https://sbutshingiacademy.co.za/images/logo.jpg',
      telephone: '+27735875718',
      email: 'khanyabutshingi22@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mqonci',
        addressRegion: 'Eastern Cape',
        addressCountry: 'ZA',
      },
      areaServed: 'Chris Hani District, Eastern Cape',
    });

    this.news.loadPublished().subscribe();
  }

  get latestNews() {
    return this.news.published().slice(0, 3);
  }
}
