import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParkService, Park } from '../../servicers/parks.service';
import { BehaviorSubject } from 'rxjs';
import { Post, PostService } from '../../servicers/posts.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-park',
  imports: [
    MatCardModule,
    CommonModule,
    PostComponent
  ],
  standalone: true,
  templateUrl: './park.component.html',
  styleUrl: './park.component.scss'
})
export class ParkComponent implements OnInit {
  private parkService = inject(ParkService);
  private postService = inject(PostService);

  private route = inject(ActivatedRoute);

  parkId: string | null = null;
  park: Park | null = null;
  parkPosts: Post[] = [];
  loading$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.parkId = this.route.snapshot.paramMap.get('id');

    if (this.parkId) {
      this.parkService.fetchById(this.parkId).subscribe({
        next: (park) => this.park = park
      });
      this.postService.fetchByParkId(this.parkId);
      this.postService.parkPosts$.subscribe(posts => this.parkPosts = posts);
    }
  }
}
