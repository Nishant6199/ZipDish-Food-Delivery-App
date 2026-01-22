import { Component, Input } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-owner-item-card',
  imports: [MatIcon, RouterLink],
  templateUrl: './owner-item-card.html',
  styleUrl: './owner-item-card.css',
})
export class OwnerItemCard {

  @Input() item: any;

}
