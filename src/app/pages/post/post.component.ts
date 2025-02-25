import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class PostComponent {
  @Input() post!: Post;
  constructor() {
    console.log('PostComponent created');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('PostComponent changes:', changes);
  }

}
