import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParkService, Park } from '../../servicers/parks.service';
import { BehaviorSubject } from 'rxjs';
import { Post, PostService } from '../../servicers/posts.service';
import { PostComponent } from '../../components/post/post.component';

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
  loading$ = new BehaviorSubject<boolean>(false);

  parkPosts = this.postService.parkPosts;
  loading = this.postService.loading;

  constructor() {
    console.log('ParkComponent created');
  }

  ngOnInit() {
    console.log('ParkComponent initialized');
    this.route.paramMap.subscribe(params => {
      this.parkId = params.get('id');

      if (this.parkId) {
        this.parkService.fetchById(this.parkId).subscribe({
          next: (park) => this.park = park
        });

        this.postService.fetchByParkId(this.parkId);
      }
    });
  }

  trackByPostId(index: number, post: Post) {
    return post.id;
  }
}
