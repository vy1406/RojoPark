import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../servicers/posts.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnChanges {
  @Input() post!: Post;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] && changes['post'].currentValue) {
      console.log('Post updated:', this.post);
    }
  }

}
