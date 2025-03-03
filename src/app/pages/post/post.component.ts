import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment, Post, PostService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { ImgComponent } from '../../components/img/img.component';
import { CommentsComponent } from "../../components/comments/comments.component";

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    ImgComponent,
    CommentsComponent
  ],
  standalone: true,
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

  onAddComment(newComment: Partial<Comment>) {
    console.log(' New comment received:', newComment);

    const commentToPush = {
      ...newComment,
      id: Math.random().toString(36).substring(7),
      commentator: {
        id: '123',
        username: 'John Doe'
      },
      date: new Date().toISOString()
    }
    if (!this.post) return;

    if (!this.post.comments) {
      this.post.comments = [];
    }

    this.post.comments.push(commentToPush as Comment);

  }

}
