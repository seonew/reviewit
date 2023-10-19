export type BookProps = {
  title: string;
  author: string;
  discount: string;
  image: string;
  link: string;
  isbn: string;
  pubdate: string;
  publisher?: string;
  description?: string;
  catalogLink: string;
};

export type ReviewDataProps = {
  reviews: ReviewProps[];
  count: number;
  stats: [];
};

export type ProductProps = {
  title: string;
  image: string;
  link: string;
  lprice: string;
  brand: string;
  productId: string;
  mall: string;
  maker?: string;
  productType?: string;
  category: string;
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
  runtime: number;
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

export type BookReviewProps = ReviewProps & {
  userId: string;
};

export type ReviewProps = {
  id: string;
  content: string;
  like?: boolean;
  contentId: string;
  contentLike?: boolean;
  contentImgUrl?: string;
  contentTitle?: string;
  userName?: string;
  updateDate: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  loginType: string;
};

export type LocalCompany = {
  title: string;
  address: string;
  category: string;
  mapx: number;
  mapy: number;
  roadAddress: string;
  telephone?: string;
  link?: string;
  description?: string;
};

type Lat = number;
type Lng = number;
export type Coordinates = [Lat, Lng];
export type NaverMap = naver.maps.Map;
export type KakaoMap = kakao.maps.Map;

export type LocalPlace = {
  id: string;
  name: string;
  address: string;
  category: string;
  mapx: number;
  mapy: number;
  roadAddress: string;
  telephone?: string;
  link?: string;
};

export type PlaceReviewDataProps = {
  data: PlaceReviewProps[];
  locals: LocalPlace[];
};

export type PlaceReviewProps = {
  place: { id: string; name: string; link?: string };
  items: ReviewDataProps;
};
