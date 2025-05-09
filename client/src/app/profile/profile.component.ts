import { Component } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = { name: '', email: '', phone: '', place: '', profileImage: '' };
  selectedFile: File | null = null;

  constructor(private profileService: ProfileService) {}

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        console.log("✅ Profile data:", res);
        this.user = res; // Update user data
      },
      error: (err: any) => console.error("❌ Error fetching profile:", err)
    });
  }

  ngOnInit() {
    this.getProfile();
  }
  

  updateProfile() {
    this.profileService.updateProfile(this.user).subscribe(
      (response) => {
        alert('Profile updated successfully');
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadProfileImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);
      
      this.profileService.uploadProfileImage(formData).subscribe(
        (response) => {
          alert('Profile image uploaded successfully');
          this.getProfile();
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
}


