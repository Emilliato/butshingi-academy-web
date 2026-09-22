import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './floating-contact.html',
  styleUrl: './floating-contact.scss',
})
export class FloatingContactComponent {
  readonly open = signal(false);

  readonly whatsappUrl =
    'https://wa.me/27735875718?text=' +
    encodeURIComponent("Hi! I'd like to find out more about S. Butshingi Academy.");

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }
}
