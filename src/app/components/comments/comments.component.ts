import { Component, Input } from '@angular/core';
import { Comment } from '../../servicers/posts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  @Input() comments!: Comment[];

  trackByCommentId(index: number, comment: Comment) {
    return comment.id;
  }
}
