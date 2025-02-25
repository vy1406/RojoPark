import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParkService, Park } from '../../servicers/parks.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Post, PostService } from '../../servicers/posts.service';
import { PostComponent } from '../../components/post-item/post.component';

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

  selectedPark$ = this.parkService.selectedPark$;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const parkId = params.get('id');
        if (parkId) {
          this.postService.fetchByParkId(parkId);
          return this.parkService.fetchById(parkId)
        }
        return [];
      })
    ).subscribe();
  }

  trackByPostId(index: number, post: Post) {
    return post.id;
  }
}
