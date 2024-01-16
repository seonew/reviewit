import { StateCreator } from "zustand";
import {
  BookProps,
  LikedBook,
  LikedContent,
  LikedProduct,
  ProductProps,
  ReviewDataProps,
} from "@/types";
import { CommonSlice } from "./commonSlice";

type State = {
  likedBooks: LikedBook[];
  likedProducts: LikedProduct[];
  likedContents: LikedContent[];
  topProducts: ProductProps[];
  dashboardBooks: BookProps[];
  dashboardProducts: ProductProps[];
  currentBookReview: ReviewDataProps;
  currentBook: LikedBook;
};

type Actions = {
  updateLikedProducts: (item: LikedProduct) => void;
  updateCheckedToTopProducts: (item: LikedProduct) => void;
  fetchLikedContents: () => void;
  addLikedBook: (book: LikedBook) => void;
  deleteLikedBook: (id: string) => void;

  initTopProducts: (products: ProductProps[]) => void;
  fetchDashboardProducts: (products: ProductProps[]) => void;
  updateDashboardBooks: (page: number, displayCount?: number) => void;
  updateDashboardProducts: (page: number) => void;
  setDashboardBooks: (books: BookProps[]) => void;
  setDashboardBooksAndCurrentBook: (id: string, checked: boolean) => void;
  setCurrentBook: (book: LikedBook) => void;

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
  likedContents: [],
  topProducts: [],
  dashboardBooks: [],
  dashboardProducts: [],
  currentBookReview: {
    reviews: [],
    count: 0,
    stats: [],
  },
  currentBook: {
    title: "",
    author: "",
    discount: "",
    image: "",
    link: "",
    isbn: "",
    pubdate: "",
    catalogLink: "",
    checked: false,
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
  updateDashboardBooks: async (page, displayCount = 20) => {
    try {
      const res = await fetch(
        `/dashboard/books/api?page=${page}&displayCount=${displayCount}`
      );
      const data = await res.json();
      set({ dashboardBooks: data.books });
    } catch (e) {
      console.error(e);
    }
  },
  fetchLikedContents: async () => {
    const contentType = "book";
    const res = await fetch(`/api/bookmarks/${contentType}`);
    const data: LikedContent[] = await res.json();
    set({ likedContents: data });
  },
  addLikedBook: async (book) => {
    try {
      const contentType = "book";
      const params = {
        contentId: book.isbn,
        contentTitle: book.title,
        contentImgUrl: book.image,
        contentType,
      };

      const res = await fetch(`/api/bookmarks/${contentType}/${book.isbn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      const nextChecked: boolean = data.checked;

      get().setDashboardBooksAndCurrentBook(book.isbn, nextChecked);
      set((state) => {
        const nextLikedBooks: LikedBook[] = [
          ...state.likedBooks,
          { ...book, checked: true },
        ];
        const nextLikedContents: LikedContent[] = [
          ...state.likedContents,
          {
            id: book.isbn,
            imgUrl: book.image,
            title: book.title,
            link: book.link,
          },
        ];

        return {
          likedBooks: nextLikedBooks,
          likedContents: nextLikedContents,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  deleteLikedBook: async (id) => {
    try {
      const contentType = "book";
      const res = await fetch(`/api/bookmarks/${contentType}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const nextChecked: boolean = data.checked;

      get().setDashboardBooksAndCurrentBook(id, nextChecked);
      set((state) => {
        const nextLikedBooks: LikedBook[] = state.likedBooks.filter(
          (current) => current.isbn !== id
        );
        const nextLikedContents: LikedContent[] = state.likedContents.filter(
          (current) => current.id !== id
        );

        return {
          likedBooks: nextLikedBooks,
          likedContents: nextLikedContents,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
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
    set({
      currentBookReview: initialState.currentBookReview,
    });
  },
  setDashboardBooksAndCurrentBook: (id: string, nextChecked: boolean) => {
    set((state) => {
      const modifiedBooks = state.dashboardBooks.map((item) => {
        return id === item.isbn ? { ...item, checked: nextChecked } : item;
      });

      return {
        dashboardBooks: modifiedBooks,
        currentBook: { ...state.currentBook, checked: nextChecked },
      };
    });
  },
  setDashboardBooks: (dashboardBooks) => {
    set({ dashboardBooks });
  },
  setCurrentBook: (currentBook) => {
    set({ currentBook });
  },
  reset: () => {
    set(initialState);
  },
});

export type DashboardSlice = State & Actions;
export default createDashboardSlice;
