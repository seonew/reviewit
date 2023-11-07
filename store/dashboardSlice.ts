import { StateCreator } from "zustand";
import {
  BookProps,
  LikedBook,
  LikedProduct,
  ProductProps,
  ReviewDataProps,
} from "@/types";
import { CommonSlice } from "./commonSlice";

type State = {
  likedBooks: LikedBook[];
  likedProducts: LikedProduct[];
  topBooks: BookProps[];
  topProducts: ProductProps[];
  dashboardBooks: BookProps[];
  dashboardProducts: ProductProps[];
  currentBookReview: ReviewDataProps;
  currentProduct: ProductProps;
};

type Actions = {
  updateLikedBooks: (item: LikedBook) => void;
  updateLikedProducts: (item: LikedProduct) => void;
  updateCheckedToTopBooks: (item: LikedBook) => void;
  updateCheckedToTopProducts: (item: LikedProduct) => void;
  updateCurrentProduct: (item: ProductProps) => void;

  initTopBooks: (books: BookProps[]) => void;
  initTopProducts: (products: ProductProps[]) => void;
  fetchDashboardBooks: (books: BookProps[]) => void;
  fetchDashboardProducts: (products: ProductProps[]) => void;
  updateDashboardBooks: (page: number) => void;
  updateDashboardProducts: (page: number) => void;

  fetchBookReview: (contentId: string, page: number) => void;
  insertBookReview: (
    contentInfo: {
      contentId: string;
      contentImgUrl: string;
      contentTitle: string;
      content: string;
    },
    like: boolean
  ) => void;
  updateBookReview: (item: ReviewDataProps) => void;
  initializeBookReview: () => void;
};

const initialState: State = {
  likedBooks: [],
  likedProducts: [],
  topBooks: [],
  topProducts: [],
  dashboardBooks: [],
  dashboardProducts: [],
  currentBookReview: {
    reviews: [],
    count: 0,
    stats: [],
  },
  currentProduct: {
    title: "",
    image: "",
    link: "",
    lprice: "",
    productId: "",
    mall: "",
    category: "",
    brand: "",
  },
};

const createDashboardSlice: StateCreator<
  CommonSlice & DashboardSlice,
  [],
  [],
  DashboardSlice
> = (set, get) => ({
  ...initialState,
  fetchBookReview: async (id: string, page: number) => {
    const res = await fetch(`/dashboard/books/${id}/reviews/api?page=${page}`);
    const data = await res.json();

    set((state) => ({
      currentBookReview: data,
    }));
  },
  insertBookReview: async (contentInfo, like) => {
    const { contentId } = contentInfo;
    const params = { contentInfo, like };
    const response = await fetch(`/dashboard/books/${contentId}/reviews/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();

    if (data.status === 500) {
      alert(data.error);
      return;
    }

    get().fetchBookReview(contentId, 1);
  },
  updateBookReview: (item: ReviewDataProps) => {
    set((state) => ({
      currentBookReview: { ...state.currentBookReview, ...item },
    }));
  },
  updateCurrentProduct: (item: ProductProps) => {
    set((state) => ({ currentProduct: item }));
  },
  updateDashboardBooks: async (page) => {
    try {
      const res = await fetch(`/dashboard/books/api?page=${page}`);
      const data = await res.json();

      get().fetchDashboardBooks(data.books);
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
        nextLikedBooks = [...state.likedBooks, { ...item, checked: true }];
      }

      return { likedBooks: nextLikedBooks };
    }),
  updateDashboardProducts: async (page) => {
    try {
      const res = await fetch(`/dashboard/products/api?page=${page}`);
      const data = await res.json();

      get().fetchDashboardProducts(data.products);
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
  initializeBookReview: () => {
    set(() => ({
      currentBookReview: initialState.currentBookReview,
    }));
  },
  reset: () => {
    set(initialState);
  },
});

export type DashboardSlice = State & Actions;
export default createDashboardSlice;
