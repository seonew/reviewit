import { StateCreator } from "zustand";
import {
  BookProps,
  CurrentBookProps,
  LikedBook,
  LikedProduct,
  ProductProps,
} from "@/utils/types";
import { CommonSlice } from "./commonSlice";

type State = {
  likedBooks: LikedBook[];
  likedProducts: LikedProduct[];
  topBooks: BookProps[];
  topProducts: ProductProps[];
  dashboardBooks: BookProps[];
  dashboardProducts: ProductProps[];
  currentBook: CurrentBookProps;
  currentProduct: ProductProps;
};

type Actions = {
  updateLikedBooks: (item: LikedBook) => void;
  updateLikedProducts: (item: LikedProduct) => void;
  updateCheckedToTopBooks: (item: LikedBook) => void;
  updateCheckedToTopProducts: (item: LikedProduct) => void;
  updateCurrentBook: (item: BookProps) => void;
  updateCurrentProduct: (item: ProductProps) => void;

  initTopBooks: (books: BookProps[]) => void;
  initTopProducts: (products: ProductProps[]) => void;
  fetchDashboardBooks: (books: BookProps[]) => void;
  fetchDashboardProducts: (products: ProductProps[]) => void;
  updateDashboardBooks: (page: number) => void;
  updateDashboardProducts: (page: number) => void;

  fetchBookReview: (contentId: string) => void;
  insertBookReview: ({
    content,
    contentId,
    like,
  }: {
    content: string;
    contentId: string;
    like: boolean;
  }) => void;
  updateBookReview: (item: { reviews: []; count: number }) => void;
};

const initialState: State = {
  likedBooks: [],
  likedProducts: [],
  topBooks: [],
  topProducts: [],
  dashboardBooks: [],
  dashboardProducts: [],
  currentBook: {
    book: {
      title: "",
      author: "",
      discount: "",
      image: "",
      link: "",
      isbn: "",
      catalogLink: "",
      pubdate: "",
    },
    reviewData: {
      reviews: [],
      count: 0,
      stats: [],
    },
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
> = (set, get, api) => ({
  ...initialState,
  fetchBookReview: async (id: string) => {
    const res = await fetch(`/dashboard/books/${id}/api`);
    const data = await res.json();

    set((state) => ({
      currentBook: {
        ...state.currentBook,
        reviewData: {
          ...state.currentBook.reviewData,
          ...data,
        },
      },
    }));
  },
  insertBookReview: async ({ content, contentId, like }) => {
    const params = { content, like };
    const response = await fetch(`/dashboard/books/${contentId}/api`, {
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

    set((state) => ({
      currentBook: {
        ...state.currentBook,
        reviewData: {
          ...state.currentBook.reviewData,
          ...data,
        },
      },
    }));
  },
  updateBookReview: (item: { reviews: []; count: number }) => {
    set((state) => ({
      currentBook: {
        ...state.currentBook,
        reviewData: {
          ...state.currentBook.reviewData,
          ...item,
        },
      },
    }));
  },
  updateCurrentBook: (item: BookProps) => {
    set((state) => ({
      currentBook: {
        ...state.currentBook,
        book: {
          ...state.currentBook.book,
          ...item,
        },
      },
    }));
  },
  updateCurrentProduct: (item: ProductProps) => {
    set((state) => ({ currentProduct: item }));
  },
  updateDashboardBooks: async (page) => {
    try {
      const res = await fetch(`/dashboard/books/api?page=${page}`);
      const data = await res.json();

      createDashboardSlice(set, get, api).fetchDashboardBooks(data.books);
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

      createDashboardSlice(set, get, api).fetchDashboardProducts(data.products);
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
});

export type DashboardSlice = State & Actions;
export default createDashboardSlice;
