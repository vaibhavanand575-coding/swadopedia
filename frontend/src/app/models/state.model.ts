import { Dish } from './dish.model';

export interface StateSummary {
  id: string;
  name: string;
  region: string;
  tagline: string;
  imageUrl: string;
  dishCount: number;
}

export interface State {
  id: string;
  name: string;
  region: string;
  tagline: string;
  imageUrl: string;
  dishes: Dish[];
}
