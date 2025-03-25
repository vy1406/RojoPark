import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { FileService } from '../../services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);
  private authService = inject(AuthService);
  private fileService = inject(FileService);
  private sanitizer = inject(DomSanitizer);
  private platformId: Object = inject(PLATFORM_ID);

  @Input() avatarSvg: string | null = null;
  @Input() avatarUrl: string | null = null;
  @Input() allowFileUpload: boolean = true;
  isAvatarLoading: boolean = true;
  username: string | null = this.authService.getUsername();

  @Output() avatarUpdated = new EventEmitter<{ avatarSvg?: string; avatarUrl?: string }>();

  selectedFile: File | null = null;
  isUploading: boolean = false;


  ngOnInit() {
    if (!this.avatarUrl && !this.avatarSvg && this.username) {
      this.avatarUrl = this.avatarService.getProfilePictureUrl(this.username);
      this.avatarUpdated.emit({ avatarUrl: this.avatarUrl });
    }
  }

  onAvatarLoaded() {
    this.isAvatarLoading = false;
  }

  generateAvatar() {
    if (isPlatformBrowser(this.platformId)) {
      this.avatarService.generateRandomAvatar().subscribe(svg => {
        const utf8EncodedSvg = new TextEncoder().encode(svg);
        const base64Svg = btoa(String.fromCharCode(...utf8EncodedSvg));
        this.avatarSvg = `data:image/svg+xml;base64,${base64Svg}`;
        this.avatarUpdated.emit({ avatarSvg: this.avatarSvg });
      });
    }
  }

  onFileSelected(event: any) {
    if (!this.allowFileUpload) return;

    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // Show preview before upload
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadFile() {
    if (!this.selectedFile || !this.username) return;

    this.isUploading = true;

    this.fileService.getPresignedUrl(this.username, this.selectedFile.type).subscribe({
      next: (uploadUrl) => {
        this.fileService.uploadFileToS3(uploadUrl, this.selectedFile!).subscribe({
          next: () => {
            console.log('✅ File uploaded successfully');
            this.avatarUrl = uploadUrl.split('?')[0];
            this.avatarUpdated.emit({ avatarUrl: this.avatarUrl });
          },
          error: (error) => console.error('❌ Upload failed:', error),
          complete: () => {
            this.isUploading = false;
            this.selectedFile = null;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error getting pre-signed URL:', error);
        this.isUploading = false;
      }
    });
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    if (this.allowFileUpload) {
      fileInput.click();
    }
  }
}
