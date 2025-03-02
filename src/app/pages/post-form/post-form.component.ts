import { Component, inject } from '@angular/core';
import { Park, ParkService } from '../../servicers/parks.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, User } from '../../servicers/posts.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DateFormatPipe } from '../../pipes/date.format.pipe';

const MOCK_USER: User = { id: '1', username: 'bob' };

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    DateFormatPipe,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent {
  private parkService = inject(ParkService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  postForm!: FormGroup;
  park$!: Observable<Park>;
  selectedPark: Park | null = null;
  moderator: User = MOCK_USER;

  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;

  attachments: File[] = [];
  attachmentPreviews: string[] = [];

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      dateCreated: [this.formatDateForDynamoDB()],
      park: [null],
      moderator: [this.moderator],
    });
  }

  ngOnInit() {
    this.park$ = this.route.paramMap.pipe(
      switchMap(params => {
        const parkId = params.get('id');
        return parkId ? this.parkService.fetchById(parkId) : [];
      })
    );

    this.park$.subscribe(park => {
      if (park) {
        this.selectedPark = park;
        this.postForm.patchValue({ park: park });
      }
    });
  }

  private formatDateForDynamoDB(): string {
    return new Date().toISOString();
  }

  onThumbnailSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.thumbnailFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onAttachmentsSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      this.attachments = Array.from(files);
      this.attachmentPreviews = [];

      this.attachments.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.attachmentPreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      console.log('Attachments selected:', this.attachments.map(f => f.name));
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      const formData = new FormData();

      formData.append('title', this.postForm.get('title')?.value);
      formData.append('content', this.postForm.get('content')?.value);
      formData.append('dateCreated', this.postForm.get('dateCreated')?.value);
      formData.append('moderator', JSON.stringify(this.moderator));
      formData.append('park', JSON.stringify(this.postForm.get('park')?.value));

      this.postForm.patchValue({
        thumbnailSmall: this.thumbnailFile ? this.thumbnailFile.name : null,
        attachments: this.attachments.map(f => f.name),
      });

      const files = {
        thumbnail: this.thumbnailFile,
        attachments: [...this.attachments],
      };

      if (files.thumbnail) {
        formData.append('files[thumbnail]', files.thumbnail);
      }

      files.attachments.forEach((file, index) => {
        formData.append(`files[attachments][${index}]`, file);
      });

      console.log('Submitting FormData:', formData);
      console.log('Files object:', files);

      this.parkService.uploadPost(formData).subscribe({
        next: (response) => console.log('Upload Success:', response),
        error: (error) => console.error('Upload Failed:', error)
      });
    }
  }


  get username() {
    return this.postForm.get('moderator')?.value?.username ?? '';
  }
  get parkName() {
    return this.postForm.get('park')?.value?.name ?? '';
  }
  get postDate() {
    return this.postForm.get('dateCreated')?.value ?? '';
  }
}
