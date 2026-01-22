import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { FormsModule, NgForm } from '@angular/forms';
import { ShopService } from '../../services/shop-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-edit-shop',
  imports: [MatIcon, RouterLink, FormsModule],
  templateUrl: './create-edit-shop.html',
  styleUrl: './create-edit-shop.css',
})
export class CreateEditShop implements OnInit {

  name!: string;
  selectedImage!: File;
  city!: string;
  state!: string;
  address!: string;

  router = inject(Router)
  shopService = inject(ShopService)
  snackBar = inject(MatSnackBar);

  isEditMode = false;
  shopId!: number;

  imagePreview: string | null = null;
  existingImageUrl!: string;

  ngOnInit(): void {
    const shop = this.shopService.shop();

    if (shop) {
      this.isEditMode = true;
      this.shopId = shop.id;

      this.name = shop.name;
      this.city = shop.city;
      this.state = shop.state;
      this.address = shop.address;
      this.existingImageUrl = shop.image;
      this.imagePreview = this.existingImageUrl;
    }
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImage = file;

    this.imagePreview = URL.createObjectURL(file);
  }

  onSubmit(form: NgForm) {

    this.shopService.isLoading.set(true);

    const ownerId = localStorage.getItem("userId");

    if (!ownerId) {
      alert('Owner not logged in');
      return;
    }

    if (!this.isEditMode && !this.selectedImage) {
      alert('Please select an image');
      this.shopService.isLoading.set(false);
      return;
    }

    const formData = new FormData();

    formData.append('OwnerId', ownerId);
    formData.append('Name', this.name);
    formData.append('City', this.city);
    formData.append('State', this.state);
    formData.append('Address', this.address);

    if (this.selectedImage) {
      formData.append('Image', this.selectedImage);
    }

    if (this.isEditMode) {

      this.shopService.updateShop(this.shopId, formData).subscribe({
        next: () => {
          this.snackBar.open("Shop updated successfully", "Close", { duration: 2000 });
          this.shopService.isLoading.set(false);
          this.router.navigate(['/owner-dashboard']);
        },
        error: () => {
          this.shopService.isLoading.set(false);
        }
      });
    }

    else {

      formData.append('OwnerId', ownerId);

      this.shopService.createShop(formData).subscribe({
        next: () => {
          this.snackBar.open("Shop created successfully", "Close", { duration: 2000 });
          this.shopService.isLoading.set(false);
          this.router.navigate(['/homepage']);
        },
        error: () => {
          this.shopService.isLoading.set(false);
        }
      });
    }

  }

}
