import { StateCreator } from "zustand";
import {
  BookProps,
  LikedBook,
  LikedContent,
  LikedProduct,
  ReviewDataProps,
} from "@/types";
import { CommonSlice } from "./commonSlice";

type bookmarkParams = {
  contentId: string;
  contentTitle: string;
  contentImgUrl: string;
  contentType: string;
};

type State = {
  likedBooks: LikedContent[];
  likedProducts: LikedContent[];
  dashboardBooks: LikedBook[];
  dashboardProducts: LikedProduct[];
  currentBookReview: ReviewDataProps;
  currentBook: LikedBook;
};

type Actions = {
  addLikedBook: (book: LikedBook) => void;
  deleteLikedBook: (id: string) => void;
  updateDashboardBooks: (page: number, displayCount?: number) => void;
  setDashboardBooks: (books: BookProps[]) => void;
  setDashboardBooksAndCurrentBook: (id: string, checked: boolean) => void;
  setCurrentBook: (book: LikedBook) => void;

  addLikedProduct: (product: LikedProduct) => void;
  deleteLikedProduct: (id: string) => void;
  updateDashboardProducts: (page: number, displayCount?: number) => void;
  setDashboardProducts: (id: string, checked: boolean) => void;

  fetchLikedContents: (type: string) => void;
  insertLikedContent: (
    contentType: string,
    params: bookmarkParams
  ) => Promise<boolean>;
  deleteLikeContent: (contentType: string, id: string) => Promise<boolean>;

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
  fetchLikedContents: async (type: string) => {
    const res = await fetch(`/api/bookmarks/${type}`);
    const data: LikedContent[] = await res.json();

    if (type === "book") {
      set({ likedBooks: data });
    } else if (type === "product") {
      set({ likedProducts: data });
    }
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
      const nextChecked = await get().insertLikedContent(contentType, params);

      get().setDashboardBooksAndCurrentBook(book.isbn, nextChecked);
      set((state) => {
        const nextLikedBooks: LikedContent[] = [
          ...state.likedBooks,
          {
            id: book.isbn,
            imgUrl: book.image,
            title: book.title,
            link: book.link,
            type: contentType,
          },
        ];
        return {
          likedBooks: nextLikedBooks,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  deleteLikedBook: async (id) => {
    try {
      const contentType = "book";
      const nextChecked: boolean = await get().deleteLikeContent(
        contentType,
        id
      );
      get().setDashboardBooksAndCurrentBook(id, nextChecked);

      set((state) => {
        const nextLikedBooks: LikedContent[] = state.likedBooks.filter(
          (current) => current.id !== id
        );
        return {
          likedBooks: nextLikedBooks,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  updateDashboardProducts: async (page, displayCount = 20) => {
    try {
      const res = await fetch(
        `/dashboard/products/api?page=${page}&displayCount=${displayCount}`
      );
      const data = await res.json();
      set({ dashboardProducts: data.products });
    } catch (e) {
      console.error(e);
    }
  },
  addLikedProduct: async (product) => {
    try {
      const contentType = "product";
      const params = {
        contentId: product.productId,
        contentTitle: product.title,
        contentImgUrl: product.image,
        contentType,
      };
      const nextChecked = await get().insertLikedContent(contentType, params);

      get().setDashboardProducts(product.productId, nextChecked);
      set((state) => {
        const nextLikedProducts: LikedContent[] = [
          ...state.likedProducts,
          {
            id: product.productId,
            imgUrl: product.image,
            title: product.title,
            link: product.link,
            type: contentType,
          },
        ];
        return {
          likedProducts: nextLikedProducts,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  deleteLikedProduct: async (id) => {
    try {
      const contentType = "product";
      const nextChecked: boolean = await get().deleteLikeContent(
        contentType,
        id
      );
      get().setDashboardProducts(id, nextChecked);
      set((state) => {
        const nextLikedProducts: LikedContent[] = state.likedProducts.filter(
          (current) => current.id !== id
        );
        return {
          likedProducts: nextLikedProducts,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  insertLikedContent: async (contentType, params) => {
    const id = params.contentId;
    const res = await fetch(`/api/bookmarks/${contentType}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const checked: boolean = await res.json();
    return checked;
  },
  deleteLikeContent: async (contentType, id) => {
    const res = await fetch(`/api/bookmarks/${contentType}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const checked = await res.json();
    return checked;
  },
  initializeBookReview: () => {
    set({
      currentBookReview: initialState.currentBookReview,
    });
  },
  setDashboardProducts: (id, checked) => {
    set((state) => {
      const modifiedProducts = state.dashboardProducts.map((item) => {
        return id === item.productId ? { ...item, checked } : item;
      });

      return {
        dashboardProducts: modifiedProducts,
      };
    });
  },
  setDashboardBooksAndCurrentBook: (id, checked) => {
    set((state) => {
      const modifiedBooks = state.dashboardBooks.map((item) => {
        return id === item.isbn ? { ...item, checked } : item;
      });

      return {
        dashboardBooks: modifiedBooks,
        currentBook: { ...state.currentBook, checked },
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
