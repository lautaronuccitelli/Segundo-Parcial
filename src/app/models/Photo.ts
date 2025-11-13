export interface Photo {
  id?: number | string;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}