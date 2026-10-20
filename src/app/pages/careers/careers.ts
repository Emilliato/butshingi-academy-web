import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { CareerService } from '../../core/services/career.service';
import { CareerApplication } from '../../core/models/career-application.model';
import { RevealDirective } from '../../core/directives/reveal.directive';

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RevealDirective],
  templateUrl: './careers.html',
  styleUrl: './careers.scss',
})
export class CareersComponent implements OnInit {
  private seo = inject(SeoService);
  private fb = inject(FormBuilder);
  private careers = inject(CareerService);

  readonly submitting = signal(false);
  readonly submitted = signal<CareerApplication | null>(null);
  readonly submitError = signal<string | null>(null);
  readonly cvFile = signal<File | null>(null);
  readonly cvError = signal<string | null>(null);

  readonly positions = [
    'Mathematics Tutor',
    'English / Home Language Tutor',
    'Physical Sciences Tutor',
    'Life Sciences Tutor',
    'Accounting Tutor',
    'General Subject Tutor',
    'Teaching Assistant',
    'Administrative Support',
    'Other',
  ];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+()\s-]{7,15}$/)]],
    positionAppliedFor: ['', Validators.required],
    yearsOfExperience: [''],
    coverLetter: ['', [Validators.required, Validators.minLength(30)]],
    dataProcessingConsent: [false, Validators.requiredTrue],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Careers — Join our team',
      description: 'Apply to join S. Butshingi Academy as a tutor, educator or support staff member. Submit your CV and cover letter online.',
      path: '/careers',
    });
  }

  onCvSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.cvError.set(null);

    if (!file) {
      this.cvFile.set(null);
      return;
    }
    if (!ACCEPTED_CV_TYPES.includes(file.type)) {
      this.cvError.set('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      this.cvFile.set(null);
      input.value = '';
      return;
    }
    if (file.size > MAX_CV_SIZE_BYTES) {
      this.cvError.set('That file is too large — please keep your CV under 5MB.');
      this.cvFile.set(null);
      input.value = '';
      return;
    }
    this.cvFile.set(file);
  }

  submit(): void {
    if (this.form.invalid || !this.cvFile()) {
      this.form.markAllAsTouched();
      if (!this.cvFile()) this.cvError.set('Please attach your CV.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
    const { dataProcessingConsent, ...value } = this.form.getRawValue();

    this.careers.submit({ ...value, cvFile: this.cvFile()! }).subscribe({
      next: (record) => {
        this.submitting.set(false);
        this.submitted.set(record);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Something went wrong submitting your application. Please try again or email your CV directly.');
      },
    });
  }

  startNewApplication(): void {
    this.form.reset({ dataProcessingConsent: false });
    this.cvFile.set(null);
    this.cvError.set(null);
    this.submitted.set(null);
  }

  field(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }
}
