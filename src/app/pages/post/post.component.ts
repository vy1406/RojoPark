import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment, Post, PostService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { ImgComponent } from '../../components/img/img.component';
import { CommentsComponent } from "../../components/comments/comments.component";
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth-service.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    ImgComponent,
    CommentsComponent,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})

export class PostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private confirmDialogService = inject(ConfirmDialogService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  post: Post | null = null;
  loggedInUserId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');

      if (postId) {
        this.postService.fetchPostById(postId).subscribe({
          next: (post) => this.post = post
        });
      }
    });

    this.loggedInUserId = this.authService.getUserId();
  }

  onAddComment(newComment: Partial<Comment>) {
    console.log(' comment received:', newComment);

    const commentToPush = { // TODO for now used a mock user
      ...newComment,
      id: Math.random().toString(36).substring(7),
      commentator: {
        id: '1',
        username: 'bob'
      },
      date: new Date().toISOString()
    }
    if (!this.post) return;

    if (!this.post.comments) {
      this.post.comments = [];
    }

    this.post.comments.push(commentToPush as Comment);

  }

  onDeletePost(postId: string) {
    this.toastService.show('Post deleted successfully!', 'Close');
    // this.confirmDialogService.openConfirmDialog({
    //   title: 'Delete Post',
    //   message: 'Are you sure you want to delete this post? This action cannot be undone.'
    // }).subscribe(confirmed => {
    //   if (confirmed) {
    //     console.log(`${postId} deleted`);

    //   } else {
    //     console.log('cacnel delete');
    //   }
    // });
  }

  isPostOwner(): boolean {
    return this.post?.moderator?.id === this.loggedInUserId;
  }
}
