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

const MOCK_USER: User = { "id": "1", "username": "bob" }
@Component({
  selector: 'app-post-form',
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
  styleUrl: './post-form.component.scss'
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
  attachments: File[] = [];

  constructor() {
    this.initForm();
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
  private initForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      dateCreated: [this.formatDateForDynamoDB()],
      park: [null],
      moderator: [this.moderator]
    });
  }

  private formatDateForDynamoDB(): string {
    return new Date().toISOString()
  }


  onThumbnailSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.thumbnailFile = file;
      console.log('Thumbnail selected:', file.name);
    }
  }

  onAttachmentsSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      this.attachments = Array.from(files);
      console.log('Attachments selected:', this.attachments.map(f => f.name));
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = this.postForm.value;
      console.log('Submitting post:', newPost);
      // Send `newPost` to your service or API
    }
  }


  get username() { return this.postForm.get('moderator')?.value?.username ?? ''; }
  get parkName() { return this.postForm.get('park')?.value?.name ?? ''; }
  get postDate() { return this.postForm.get('dateCreated')?.value ?? ''; }
}
