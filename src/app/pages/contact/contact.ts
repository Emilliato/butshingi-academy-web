import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { GoogleMapComponent } from '../../shared/components/google-map/google-map';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective, GoogleMapComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit {
  private seo = inject(SeoService);
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['General enquiry', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Contact us',
      description: 'Get in touch with S. Butshingi Academy in Mqonci, Chris Hani District, Eastern Cape — call, email or find us on the map.',
      path: '/contact',
    });
  }

  sendViaEmail(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, subject, message } = this.form.getRawValue();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:khanyabutshingi22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }
}
