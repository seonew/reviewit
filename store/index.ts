import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  BookProps,
  LikedBook,
  LikedProduct,
  ProductProps,
  MovieProps,
  CurrentMovieProps,
  ReviewProps,
  User,
} from "@/utils/types";
import { replaceDateFormat } from "@/utils/common";

type State = {
  likedBooks: LikedBook[];
  likedProducts: LikedProduct[];
  isOpen: boolean;
  topBooks: BookProps[];
  topProducts: ProductProps[];
  dashboardBooks: BookProps[];
  dashboardProducts: ProductProps[];
  dashboardMovies: MovieProps[];
  currentMovie: CurrentMovieProps;
  user: User;
  isSignedIn: boolean;
};

type Actions = {
  updateLikedBooks: (item: LikedBook) => void;
  updateLikedProducts: (item: LikedProduct) => void;
  updateCheckedToTopBooks: (item: LikedBook) => void;
  updateCheckedToTopProducts: (item: LikedProduct) => void;

  initTopBooks: (books: BookProps[]) => void;
  initTopProducts: (products: ProductProps[]) => void;
  fetchDashboardBooks: (books: BookProps[]) => void;
  fetchDashboardProducts: (products: ProductProps[]) => void;
  updateDashboardBooks: (page: number) => void;
  updateDashboardProducts: (page: number) => void;
  setIsOpen: (item: boolean) => void;

  fetchDashboardMovies: (movies: MovieProps[]) => void;
  fetchMovieDetail: (id: string) => void;
  insertMovieReview: ({
    review,
    movieId,
  }: {
    review: string;
    movieId: string;
  }) => void;

  fetchUserInfo: (token: string) => void;
  setIsSignedIn: (item: boolean) => void;
  signOut: () => void;
};

const initialState: State = {
  likedBooks: [],
  likedProducts: [],
  topBooks: [],
  topProducts: [],
  dashboardBooks: [],
  dashboardProducts: [],
  dashboardMovies: [],
  currentMovie: {
    movie: {
      id: "",
      title: "",
      releaseDate: "",
      genres: [],
      originalTitle: "",
      tagline: "",
      budget: 0,
      revenue: 0,
      runtime: "",
      average: 0,
      adult: false,
    },
    keywords: [],
    recommendations: [],
    reviewData: {
      reviews: [],
      count: 0,
    },
    similars: [],
    videos: [],
  },
  user: {
    id: "",
    name: "",
    loginType: "",
    avatarUrl: "",
  },
  isSignedIn: false,
  isOpen: false,
};

const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        signOut: () => {
          const storage = localStorage.getItem("item-storage");
          if (storage) {
            try {
              const object = JSON.parse(storage);
              delete object.user;

              localStorage.setItem("item-storage", JSON.stringify(object));
            } catch (error) {}
          }

          set((state) => {
            return { isSignedIn: false, user: initialState.user };
          });
        },
        setIsSignedIn: (item: boolean) =>
          set((state) => {
            return { isSignedIn: item };
          }),
        fetchUserInfo: async (token: string) => {
          try {
            const res = await fetch(`/api/user?token=${token}`);
            const data = await res.json();

            set((state) => ({ user: data }));
          } catch (error) {
            console.log(error);
          }
        },
        insertMovieReview: ({ review, movieId }) =>
          set((state) => {
            const response: ReviewProps = {
              id: Date.now().toString(),
              movieId: movieId,
              author: state.user.name,
              content: review,
              updateDate: replaceDateFormat(new Date().toString()),
            };

            return {
              currentMovie: {
                ...state.currentMovie,
                reviewData: {
                  ...state.currentMovie.reviewData,
                  reviews: [response, ...state.currentMovie.reviewData.reviews],
                  count: state.currentMovie.reviewData.count + 1,
                },
              },
            };
          }),
        fetchMovieDetail: async (id) => {
          try {
            const res = await fetch(`/movie/${id}/api`);
            const data = await res.json();

            set((state) => ({ currentMovie: data }));
          } catch (error) {
            console.log(error);
          }
        },
        fetchDashboardMovies: (movies) =>
          set((state) => ({
            dashboardMovies: movies,
          })),
        updateDashboardBooks: async (page) => {
          try {
            const res = await fetch(`/dashboard/books/api?page=${page}`);
            const data = await res.json();

            useStore.getState().fetchDashboardBooks(data.books);
          } catch (e) {
            console.error(e);
          }
        },
        fetchDashboardBooks: (books) =>
          set((state) => {
            const modifiedBooks = books.map((item) => {
              const commonElement = state.likedBooks.find(
                (likeItem) => likeItem.isbn === item.isbn
              );
              return commonElement ? { ...item, ...commonElement } : item;
            });

            return {
              dashboardBooks: modifiedBooks,
            };
          }),
        updateLikedBooks: (item) =>
          set((state) => {
            let nextLikedBooks: LikedBook[] = [];
            const isExists = state.likedBooks.some(
              (current) => current.isbn === item.isbn
            );

            if (isExists) {
              nextLikedBooks = state.likedBooks.filter(
                (current) => current.isbn !== item.isbn
              );
            } else {
              nextLikedBooks = [
                ...state.likedBooks,
                { ...item, checked: true },
              ];
            }

            return { likedBooks: nextLikedBooks };
          }),
        updateDashboardProducts: async (page) => {
          try {
            const res = await fetch(`/dashboard/products/api?page=${page}`);
            const data = await res.json();

            useStore.getState().fetchDashboardProducts(data.products);
          } catch (e) {
            console.error(e);
          }
        },
        fetchDashboardProducts: (products) =>
          set((state) => {
            const modifiedProducts = products.map((product) => {
              const commonElement = state.likedProducts.find(
                (likeItem) => likeItem.productId === product.productId
              );
              return commonElement ? { ...product, ...commonElement } : product;
            });

            return {
              dashboardProducts: modifiedProducts,
            };
          }),
        updateLikedProducts: (item) =>
          set((state) => {
            const isExists = state.likedProducts.some(
              (current) => current.productId === item.productId
            );

            let nextLikedProducts = [];
            if (isExists) {
              nextLikedProducts = state.likedProducts.filter(
                (current) => current.productId !== item.productId
              );
            } else {
              nextLikedProducts = [
                ...state.likedProducts,
                { ...item, checked: true },
              ];
            }

            return { likedProducts: nextLikedProducts };
          }),
        updateCheckedToTopBooks: (item) =>
          set((state) => {
            const nextTopBooks: BookProps[] = state.topBooks.map((current) => {
              return current.isbn === item.isbn
                ? { ...item, checked: !item.checked }
                : current;
            });

            return { topBooks: nextTopBooks };
          }),
        updateCheckedToTopProducts: (item) =>
          set((state) => {
            const nextTopProducts: ProductProps[] = state.topProducts.map(
              (current) => {
                return current.productId === item.productId
                  ? { ...item, checked: !item.checked }
                  : current;
              }
            );

            return { topProducts: nextTopProducts };
          }),
        initTopBooks: (books) =>
          set((state) => {
            const modifiedBooks: BookProps[] = books.map((item) => {
              const commonElement = state.likedBooks.find(
                (likeItem) => likeItem.isbn === item.isbn
              );
              return commonElement ? { ...item, ...commonElement } : item;
            });

            return {
              topBooks: modifiedBooks,
            };
          }),
        initTopProducts: (products) =>
          set((state) => {
            const modifiedProducts: ProductProps[] = products.map((item) => {
              const commonElement = state.likedProducts.find(
                (likeItem) => likeItem.productId === item.productId
              );
              return commonElement ? { ...item, ...commonElement } : item;
            });

            return {
              topProducts: modifiedProducts,
            };
          }),
        reset: () => {
          set(initialState);
        },
        setIsOpen: (item) => set({ isOpen: item }),
      }),
      {
        name: "item-storage",
      }
    )
  )
);

export default useStore;
