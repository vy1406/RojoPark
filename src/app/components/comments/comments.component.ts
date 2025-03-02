import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../servicers/posts.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comments',
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  @Input() comments!: Comment[];
  @Output() addComment = new EventEmitter<Partial<Comment>>();
  showCommentForm = false;
  newCommentContent = '';

  trackByCommentId(index: number, comment: Comment) {
    return comment.id;
  }

  onAddComment() {
    if (!this.newCommentContent.trim()) return;

    const newComment: Partial<Comment> = {
      content: this.newCommentContent,
    };

    this.addComment.emit(newComment);

    this.newCommentContent = '';
    this.showCommentForm = false;
  }

}
