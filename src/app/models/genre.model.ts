import { SubgenreModel } from './subgenre.model';

export interface GetGenreModel {
  genres: GenreModel[];
}

export interface GenreModel {
  id: number;
  name: string;
  subgenres: SubgenreModel[];
}
