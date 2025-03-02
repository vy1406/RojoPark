import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../servicers/posts.service';
import { Router } from '@angular/router';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [
    MatCardModule,
    ImgComponent,
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post!: Post;
  private router = inject(Router);
  constructor() {
    console.log('PostComponent created');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('PostComponent changes:', changes);
  }

  onPostClick() {
    this.router.navigate(['/post', this.post.id]);
  }
}
