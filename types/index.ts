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
  stats?: StatsProps[];
};

export type StatsProps = {
  id: number;
  displayText: string;
  percentText: string;
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

export type MovieApiResponse = {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  adult?: boolean;
};

export type ProductApiResponse = {
  title: string;
  image: string;
  link: string;
  lprice: string;
  brand: string;
  productId: string;
  mallName: string;
  maker: string;
  productType: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
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
  userId: string;
  updateDate: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  loginType: string;
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
  categoryCode: string;
  mapx: number;
  mapy: number;
  roadAddress: string;
  telephone?: string;
  link?: string;
  displayReviewCount?: string;
};

export type PlaceReviewsWithKeywordDataProps = {
  data: PlaceReviewWithKeywordProps[];
  locals: LocalPlace[];
};

export type PlaceReviewWithKeywordProps = {
  place: { id: string; name: string; link?: string };
  items: ReviewDataProps;
};

export type PlaceReviewDataProps = {
  data: PlaceReviewProps[];
  locals: LocalPlace[];
  count: number;
};

export type PlaceReviewProps = {
  place: { id: string; name: string; link?: string; categoryCode: string };
  review: ReviewProps;
};
