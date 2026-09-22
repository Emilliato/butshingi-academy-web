import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface TeamMember {
  initials: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit {
  private seo = inject(SeoService);

  readonly team: TeamMember[] = [
    { initials: 'KB', name: 'Khanya Butshingi', role: 'Project Manager' },
    { initials: 'VN', name: 'Vuyisa Ntshinka', role: 'Financial Officer' },
    { initials: 'NM', name: 'Nontyatyambo Mkalali', role: 'Director' },
    { initials: 'AM', name: 'Asazama Makhwenkwe', role: 'Academic Lead' },
    { initials: 'VM', name: 'Vuyolwethu Manqeyi', role: 'Director' },
    { initials: 'SH', name: 'Sithandiwe Hlayo', role: 'Monitoring & Evaluation Lead' },
  ];

  readonly timeline = [
    { year: 'Founded', copy: 'Registered as an NPO (Reg 2020/119065/07) to serve learners in Mqonci, Chris Hani District.' },
    { year: 'Growing', copy: 'Grew to support 81 learners a year through classroom, digital and academic support programmes.' },
    { year: 'Today', copy: 'Nine educators, a football programme, and four annual award luncheons hosted for top-performing learners.' },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'About us',
      description:
        'Meet the team behind S. Butshingi Academy and learn about our vision, mission and community roots in Mqonci, Eastern Cape.',
      path: '/about',
    });
  }
}
