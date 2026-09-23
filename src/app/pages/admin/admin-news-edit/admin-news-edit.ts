import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../../../core/services/news.service';
import { NewsPost } from '../../../core/models/news.model';

@Component({
  selector: 'app-admin-news-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-news-edit.html',
  styleUrl: './admin-news-edit.scss',
})
export class AdminNewsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private news = inject(NewsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editing: NewsPost | undefined;
  readonly saved = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly categories = ['Announcement', 'Event', 'Achievement', 'Community'];
  readonly emojiOptions = ['📝', '🏆', '⚽', '📚', '💻', '🎓', '🎉', '📢', '🌱', '🤝'];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    excerpt: ['', [Validators.required, Validators.minLength(10)]],
    body: ['', [Validators.required, Validators.minLength(20)]],
    category: ['Announcement' as NewsPost['category'], Validators.required],
    coverEmoji: ['📝', Validators.required],
    coverImage: [''],
    author: ['', Validators.required],
    published: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.news.fetchById(id).subscribe({
        next: (post) => {
          this.editing = post;
          this.form.patchValue(post);
        },
        error: () => this.router.navigateByUrl('/admin/news'),
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);

    const request$ = this.editing
      ? this.news.update(this.editing.id, value)
      : this.news.create({ ...value, publishedAt: new Date().toISOString() });

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.router.navigateByUrl('/admin/news'), 600);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Could not save this post. Please try again.');
      },
    });
  }

  field(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }
}
