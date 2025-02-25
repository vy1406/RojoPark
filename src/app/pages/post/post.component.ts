import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PostService } from '../../servicers/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [
    MatCardModule,
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
  }

}
