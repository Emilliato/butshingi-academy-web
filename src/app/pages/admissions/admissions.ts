import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { ApplicationService } from '../../core/services/application.service';
import { IntakeApplication, IntakeApplicationDraft } from '../../core/models/application.model';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { FEE_PER_SUBJECT, MATRIC_SUBJECTS, REGISTRATION_FEE } from '../../core/data/subjects';

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
  readonly submitError = signal<string | null>(null);

  readonly grades = ['Matric Rewrite (Grade 12)'];

  readonly subjectOptions = MATRIC_SUBJECTS.map((s) => s.title);
  readonly selectedSubjects = signal<string[]>([]);
  readonly subjectsTouched = signal(false);
  readonly feeEstimate = computed(() => REGISTRATION_FEE + FEE_PER_SUBJECT * this.selectedSubjects().length);
  readonly registrationFee = REGISTRATION_FEE;
  readonly feePerSubject = FEE_PER_SUBJECT;

  readonly steps = [
    { title: 'Complete the form', copy: 'Tell us about the learner, choose the Matric rewrite subjects and add their guardian below — it takes about five minutes.' },
    { title: 'We review your application', copy: 'Our admissions team checks capacity for the chosen subjects and reviews every submission individually.' },
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
    dataProcessingConsent: [false, Validators.requiredTrue],
    photoConsent: [false],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: `Admissions — Matric rewrite applications — ${this.nextIntakeYear} intake`,
      description: `Apply online for Matric rewrite at S. Butshingi Academy for the ${this.nextIntakeYear} intake. Choose your subjects and our team will contact you directly.`,
      path: '/admissions',
    });
  }

  submit(): void {
    this.subjectsTouched.set(true);
    if (this.form.invalid || this.selectedSubjects().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
    const { dataProcessingConsent, ...value } = this.form.getRawValue();

    // The admissions API has no subjects field yet, so the chosen subjects travel with the motivation text.
    const motivation = `${value.motivation}\n\nSubjects chosen: ${this.selectedSubjects().join(', ')}`;

    this.applications.submit({ ...value, motivation, intakeYear: this.nextIntakeYear }).subscribe({
      next: (record) => {
        this.submitting.set(false);
        this.submitted.set(record);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Something went wrong submitting your application. Please try again or contact us directly.');
      },
    });
  }

  startNewApplication(): void {
    this.form.reset({
      learnerGender: 'Prefer not to say',
      hasSpecialNeeds: false,
      dataProcessingConsent: false,
      photoConsent: false,
    });
    this.selectedSubjects.set([]);
    this.subjectsTouched.set(false);
    this.submitted.set(null);
  }

  toggleSubject(subject: string): void {
    this.subjectsTouched.set(true);
    this.selectedSubjects.update((list) =>
      list.includes(subject) ? list.filter((s) => s !== subject) : [...list, subject],
    );
  }

  field(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }
}
