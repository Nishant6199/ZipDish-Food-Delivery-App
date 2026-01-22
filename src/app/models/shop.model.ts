export interface Shop {
  id: number;
  name: string;
  image: string;
  city: string;
  state: string;
  address: string;
  ownerId: number;
  owner: Owner;
  items: Item[];
  createdAt: string;
}

export interface Owner {
  id: number;
  fullName: string;
  email: string;
  mobileNo: string;
  role: string;
}

export interface Item {
  id: number;
  name: string;
  image: string;
  category: string;
  foodType: string;
  price: number;
  shopId: number;
  createdAt: string;
}
