export type BookProps = {
  title: string;
  author: string;
  discount: string;
  image: string;
  link: string;
  isbn: string;
  publisher?: string;
  description?: string;
};

export type ProductProps = {
  title: string;
  image: string;
  link: string;
  lprice: string;
  brand: string;
  productId: string;
};

export type LikedBook = BookProps & {
  checked?: boolean;
};

export type LikedProduct = ProductProps & {
  checked?: boolean;
};

export type MovieProps = {
  id: string;
  title: string;
  posterImage?: string;
  backdropImage?: string;
  link?: string;
  releaseDate: string;
  description?: string;
  average: number;
  adult: boolean;
};

export type DetailMovieProps = MovieProps & {
  genres: Array<{ id: string; name: string }>;
  originalTitle: string;
  tagline: string;
  budget: number;
  revenue: number;
  runtime: string;
};

export type VideoImageBannerProps = {
  id: string;
  title: string;
  posterImage: string;
  backdropImage: string;
  link: string;
  releaseDate: string;
  description?: string;
};

export type CurrentMovieProps = {
  movie: DetailMovieProps;
  keywords: Array<{ id: string; name: string }>;
  recommendations: MovieProps[];
  reviewData: { reviews: ReviewProps[]; count: number };
  similars: MovieProps[];
  videos: MediaVideoProps[];
};

export type MediaVideoProps = {
  id: string;
  title: string;
  site: string;
  type: string;
  official: string;
  publishedDate: string;
  link: string;
  backgroundImage: string;
};

export type ReviewProps = {
  id: string;
  movieId: string;
  author: string;
  content: string;
  updateDate: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  loginType: string;
};
