import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface FeeItem {
  label: string;
  amount: string;
  period: string;
  note: string;
  optional?: boolean;
}

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './fees.html',
  styleUrl: './fees.scss',
})
export class FeesComponent implements OnInit {
  private seo = inject(SeoService);

  readonly fees: FeeItem[] = [
    {
      label: 'Registration Fee',
      amount: 'R300',
      period: 'per learner',
      note: 'Paid when a learner registers to secure their place for the intake.',
    },
    {
      label: 'Tuition',
      amount: 'R300',
      period: 'per subject',
      note: 'Covers one subject of FET / Matric Prep tuition. Most learners take several subjects.',
    },
    {
      label: 'Hostel',
      amount: 'R1,850',
      period: 'per month',
      note: 'Optional boarding for learners who need accommodation close to the Academy.',
      optional: true,
    },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'Fees',
      description: "S. Butshingi Academy's tuition, registration and optional hostel fees for FET / Matric Prep learners in Mqonci, Eastern Cape.",
      path: '/fees',
    });
  }
}
