import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShopService } from '../../services/shop-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-create-update-item',
  imports: [MatIcon, RouterLink, FormsModule],
  templateUrl: './create-update-item.html',
  styleUrl: './create-update-item.css',
})
export class CreateUpdateItem implements OnInit {

  name!: string;
  selectedImage!: File;
  price!: number;

  router = inject(Router);
  itemService = inject(ItemService);
  shopService = inject(ShopService);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);

  foodtype = ["Veg", "NonVeg"];
  selectedFoodType = '';

  category = ["Snacks",
    "MainCourse",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "SouthIndian",
    "NorthIndian",
    "Chinese",
    "FastFood",
    "Others"];
  selectedCategory = '';

  isEditMode = false;
  itemId!: number;
  existingImageUrl: string | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.isEditMode = true;
        this.itemId = +id;
        this.setItemDataForEdit();
      }
    })
  }

  setItemDataForEdit() {
    const item = this.itemService.items().find(i => i.id === this.itemId);

    if (!item) {
      return;
    }

    this.name = item.name;
    this.price = item.price;
    this.selectedCategory = item.category;
    this.selectedFoodType = item.foodType;
    this.existingImageUrl = item.image;
    this.imagePreview = this.existingImageUrl;
    
  }

  async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'existing-image.jpg', { type: blob.type });
  }

  onFileSelected(event: any) {
  const file = event.target.files[0];

  if (!file) return;

  this.selectedImage = file;

  this.imagePreview = URL.createObjectURL(file);
}

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  selectFoodType(foodtype: string) {
    this.selectedFoodType = foodtype;
  }

  async  onSubmit(form: NgForm) {
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

    formData.append('UserId', ownerId);
    formData.append('Name', this.name);
    formData.append('Price', this.price.toString());
    formData.append('FoodType', this.selectedFoodType);
    formData.append('Category', this.selectedCategory);

    if (this.selectedImage) {
    formData.append('ImageFile', this.selectedImage);
  } else if (this.isEditMode && this.existingImageUrl) {
    const file = await this.urlToFile(this.existingImageUrl);
    formData.append('ImageFile', file);
  }

    if (this.isEditMode) {
      this.itemService.updateItem(this.itemId, formData).subscribe({
        next: () => {
          this.snackBar.open("Item updated successfully", "Close", { duration: 2000 });
          this.shopService.isLoading.set(false);
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          console.log(err);
          this.shopService.isLoading.set(false);
        }
      })
    } else {

      this.itemService.createItem(formData).subscribe({
        next: () => {
          this.snackBar.open("Item created successfully", "Close", { duration: 2000 });
          this.shopService.isLoading.set(false);
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          console.log(err);
          this.shopService.isLoading.set(false);
        }
      });
    }

  }

  ngOnDestroy() {
  if (this.imagePreview?.startsWith('blob:')) {
    URL.revokeObjectURL(this.imagePreview);
  }
}


}
