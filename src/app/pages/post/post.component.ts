import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment, Post, PostService } from '../../servicers/posts.service';
import { CommonModule } from '@angular/common';
import { ImgComponent } from '../../components/img/img.component';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    ImgComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  post: Post | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');

      if (postId) {
        this.postService.fetchPostById(postId).subscribe({
          next: (post) => this.post = post
        });
      }
    });
  }

  trackByCommentId(index: number, comment: Comment) {
    return comment.id;
  }
}
