import { StateCreator } from "zustand";
import { LikedBook, LikedContent, MovieProps, ReviewDataProps } from "@/types";
import { CommonSlice } from "./commonSlice";

type bookmarkParams = {
  contentId: string;
  contentTitle: string;
  contentImgUrl: string;
  contentType: string;
};

type State = {
  likedBooks: LikedContent[];

  searchedBooks: LikedBook[];
  searchedMovies: MovieProps[];

  bookReviews: ReviewDataProps;
  currentBook: LikedBook;
  loading: boolean;
  query: string;
};

type Actions = {
  addLikedBook: (book: LikedBook) => void;
  deleteLikedBook: (id: string) => void;

  initializeSearchedBooks: (books: LikedBook[]) => void;
  updateSearchedBooks: (page: number, displayCount?: number) => void;
  clearSearchedBooks: () => void;

  setSearchedBooksAndCurrentBook: (id: string, checked: boolean) => void;
  setCurrentBook: (book: LikedBook) => void;

  fetchLikedContents: (type: string) => void;
  insertLikedContent: (
    contentType: string,
    params: bookmarkParams
  ) => Promise<boolean>;
  deleteLikeContent: (contentType: string, id: string) => Promise<boolean>;
  fetchBookmarkedContent: (type: string, id: string) => Promise<boolean>;

  fetchBookReviews: (contentId: string, page: number) => void;
  insertBookReview: (
    contentInfo: {
      contentId: string;
      contentImgUrl: string;
      contentTitle: string;
      content: string;
    },
    like: boolean
  ) => void;
  initializeBookReview: () => void;
  resetDashboardData: () => void;
};

const initialState: State = {
  likedBooks: [],
  bookReviews: {
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
  loading: true,

  query: "",
  searchedBooks: [],
  searchedMovies: [],
};

const createDashboardSlice: StateCreator<
  CommonSlice & DashboardSlice,
  [],
  [],
  DashboardSlice
> = (set, get) => ({
  ...initialState,
  fetchBookReviews: async (id: string, page: number) => {
    try {
      const res = await fetch(
        `/api/dashboard/books/${id}/reviews?page=${page}`
      );
      const data = await res.json();

      set({
        bookReviews: data,
      });
      get().setSpinner(false);
    } catch (e) {
      console.error(e);
    }
  },
  insertBookReview: async (contentInfo, like) => {
    get().setSpinner(true);
    const { contentId } = contentInfo;
    const params = { contentInfo, like };
    const response = await fetch(`/api/dashboard/books/${contentId}/reviews`, {
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

    get().fetchBookReviews(contentId, 1);
  },

  updateSearchedBooks: async (page, displayCount = 20) => {
    try {
      const query = get().query;
      const res = await fetch(
        `/api/search/books/${query}?page=${page}&displayCount=${displayCount}`
      );
      const data = await res.json();
      set({ searchedBooks: data.books, loading: false });
    } catch (e) {
      console.error(e);
    }
  },
  initializeSearchedBooks: (books) => {
    set({ searchedBooks: books, loading: false });
  },
  clearSearchedBooks: () => {
    set({ searchedBooks: [], loading: true });
  },

  fetchLikedContents: async (type: string) => {
    const res = await fetch(`/api/bookmarks/${type}`);
    const data: LikedContent[] = await res.json();

    if (type === "book") {
      set({ likedBooks: data });
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

      get().setSearchedBooksAndCurrentBook(book.isbn, nextChecked);
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
      get().setSearchedBooksAndCurrentBook(id, nextChecked);

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

  insertLikedContent: async (contentType, params) => {
    const id = params.contentId;
    const res = await fetch(`/api/bookmarks/${contentType}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    return data.checked;
  },
  deleteLikeContent: async (contentType, id) => {
    const res = await fetch(`/api/bookmarks/${contentType}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.checked;
  },
  fetchBookmarkedContent: async (contentType, id) => {
    const res = await fetch(`/api/bookmarks/${contentType}/${id}`);
    const checked = await res.json();
    return checked;
  },
  initializeBookReview: () => {
    set({
      bookReviews: initialState.bookReviews,
    });
  },

  setSearchedBooksAndCurrentBook: (id, checked) => {
    set((state) => {
      const modifiedBooks = state.searchedBooks.map((item) => {
        return id === item.isbn ? { ...item, checked } : item;
      });

      return {
        searchedBooks: modifiedBooks,
        currentBook: { ...state.currentBook, checked },
      };
    });
  },
  setCurrentBook: async (currentBook) => {
    const checked = await get().fetchBookmarkedContent(
      "book",
      currentBook.isbn
    );
    set((state) => {
      const nextCurrentBook = { ...state.currentBook, checked };
      return { currentBook: nextCurrentBook };
    });
  },
  resetDashboardData: () => {
    set(initialState);
  },
});

export type DashboardSlice = State & Actions;
export default createDashboardSlice;
