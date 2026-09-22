import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { ApplicationService } from '../../core/services/application.service';
import { IntakeApplication, IntakeApplicationDraft } from '../../core/models/application.model';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RevealDirective],
  templateUrl: './admissions.html',
  styleUrl: './admissions.scss',
})
export class AdmissionsComponent implements OnInit {
  private seo = inject(SeoService);
  private fb = inject(FormBuilder);
  private applications = inject(ApplicationService);

  readonly nextIntakeYear = new Date().getFullYear() + 1;
  readonly submitting = signal(false);
  readonly submitted = signal<IntakeApplication | null>(null);

  readonly grades = [
    'Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  ];

  readonly steps = [
    { title: 'Complete the form', copy: 'Tell us about the learner and their guardian below — it takes about five minutes.' },
    { title: 'We review your application', copy: 'Our admissions team checks capacity for the requested grade and reviews every submission individually.' },
    { title: 'We contact you', copy: 'Expect a call or email confirming placement, required documents and orientation dates.' },
  ];

  readonly form = this.fb.nonNullable.group({
    learnerFirstName: ['', [Validators.required, Validators.minLength(2)]],
    learnerLastName: ['', [Validators.required, Validators.minLength(2)]],
    learnerDob: ['', Validators.required],
    learnerGender: ['Prefer not to say' as IntakeApplicationDraft['learnerGender'], Validators.required],
    gradeApplyingFor: ['', Validators.required],
    homeLanguage: ['', Validators.required],
    previousSchool: [''],
    guardianName: ['', Validators.required],
    guardianRelationship: ['', Validators.required],
    guardianPhone: ['', [Validators.required, Validators.pattern(/^[0-9+()\s-]{7,15}$/)]],
    guardianEmail: ['', [Validators.required, Validators.email]],
    homeAddress: ['', Validators.required],
    hasSpecialNeeds: [false],
    specialNeedsDetails: [''],
    motivation: ['', [Validators.required, Validators.minLength(20)]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: `Admissions — Apply for ${this.nextIntakeYear} intake`,
      description: `Apply online for S. Butshingi Academy's ${this.nextIntakeYear} intake. Complete our admissions form and our team will contact you directly.`,
      path: '/admissions',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();

    // Simulated network latency so the flow feels real; swap for an HTTP call to a real backend.
    setTimeout(() => {
      const record = this.applications.submit({ ...value, intakeYear: this.nextIntakeYear });
      this.submitting.set(false);
      this.submitted.set(record);
    }, 500);
  }

  startNewApplication(): void {
    this.form.reset({
      learnerGender: 'Prefer not to say',
      hasSpecialNeeds: false,
    });
    this.submitted.set(null);
  }

  field(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }
}
