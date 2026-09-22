import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { NewsService } from '../../core/services/news.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';

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

  readonly stats = [
    { value: 81, suffix: '', label: 'Learners supported each year' },
    { value: 92, suffix: '%', label: 'Average academic performance' },
    { value: 100, suffix: '%', label: 'Attendance and retention' },
    { value: 9, suffix: '', label: 'Educators delivering the programme' },
  ];

  readonly pillars: Pillar[] = [
    { icon: '📚', title: 'Educational Resources', copy: 'Textbooks, workbooks, stationery, teaching aids and library materials.' },
    { icon: '💻', title: 'Digital Learning', copy: 'Computers, connectivity, digital platforms and basic ICT training.' },
    { icon: '🧠', title: 'Academic Support', copy: 'Extra lessons, remedial support, exam prep and reading programmes.' },
    { icon: '🍎', title: 'Teacher Development', copy: 'Classroom management, assessment and curriculum support training.' },
    { icon: '🌱', title: 'Learner Development', copy: 'Life skills, leadership, career guidance and financial literacy.' },
    { icon: '🏫', title: 'Infrastructure', copy: 'Classroom equipment, furniture, library and ICT facilities.' },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'S. Butshingi Academy — Mqonci, Eastern Cape',
      description:
        "A community-rooted academy in Mqonci, Chris Hani District. Quality education, digital learning and learner development — building a better world, one student at a time.",
      path: '/',
    });

    this.seo.setJsonLd('ld-school', {
      '@context': 'https://schema.org',
      '@type': 'School',
      name: 'S. Butshingi Academy',
      description:
        'A community-rooted academy in Mqonci, Chris Hani District, Eastern Cape providing quality education, digital learning and learner development.',
      url: 'https://www.butshingiacademy.org.za/',
      logo: 'https://www.butshingiacademy.org.za/images/logo.jpg',
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
  }

  get latestNews() {
    return this.news.published().slice(0, 3);
  }
}
