import { StateCreator } from "zustand";
import {
  LikedBook,
  LikedContent,
  LikedMovie,
  MovieProps,
  ReviewDataProps,
} from "@/types";
import { CommonSlice } from "./commonSlice";
import { MovieSlice } from "./movieSlice";

type bookmarkParams = {
  contentId: string;
  contentTitle: string;
  contentImgUrl: string;
  contentType: string;
};

type State = {
  likedBooks: LikedContent[];
  loadedLikedBooks: boolean;

  searchedBooks: LikedBook[];
  searchedMovies: LikedMovie[];

  bookReviews: ReviewDataProps;
  currentBook: LikedBook;
  loadedMovies: boolean;
  loadedBooks: boolean;
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
  setQuery: (item: string) => void;

  fetchSearchResults: (
    query: string,
    page: number,
    displayCount?: number
  ) => void;
  initializeSearchedMovies: (movies: MovieProps[]) => void;
  updateSearchedMovies: (page: number, displayCount?: number) => void;
  clearSearchedMovies: () => void;

  fetchLikedContents: (type: string) => void;
  insertLikedContent: (
    contentType: string,
    params: bookmarkParams
  ) => Promise<boolean>;
  deleteLikeContent: (contentType: string, id: string) => Promise<boolean>;
  fetchBookmarkedContent: (type: string, id: string) => Promise<boolean>;
  setLikedBooks: (books: LikedContent[]) => void;

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
  loadedLikedBooks: false,
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
  loadedMovies: false,
  loadedBooks: false,

  query: "",
  searchedBooks: [],
  searchedMovies: [],
};

const createDashboardSlice: StateCreator<
  CommonSlice & DashboardSlice & MovieSlice,
  [],
  [],
  DashboardSlice
> = (set, get) => ({
  ...initialState,
  fetchBookReviews: async (id: string, page: number) => {
    try {
      const res = await fetch(`/api/books/${id}/reviews?page=${page}`);
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
    const response = await fetch(`/api/books/${contentId}/reviews`, {
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
  fetchSearchResults: async (query, page, displayCount = 20) => {
    const res = await fetch(
      `/api/search/${query}?page=${page}&displayCount=${displayCount}`
    );
    const data = await res.json();

    set({
      searchedBooks: data.booksResult.books,
      searchedMovies: data.moviesResult.movies,
      query,
    });
  },

  updateSearchedBooks: async (page, displayCount = 20) => {
    try {
      const query = get().query;
      const res = await fetch(
        `/api/search/books/${query}?page=${page}&displayCount=${displayCount}`
      );
      const data = await res.json();
      set({ searchedBooks: data.books, loadedBooks: true });
    } catch (e) {
      console.error(e);
    }
  },
  initializeSearchedBooks: (books) => {
    set({ searchedBooks: books, loadedBooks: false });
  },
  clearSearchedBooks: () => {
    set({ searchedBooks: [], loadedBooks: false });
  },

  updateSearchedMovies: async (page, displayCount = 20) => {
    try {
      const query = get().query;
      const res = await fetch(
        `/api/search/movies/${query}?page=${page}&displayCount=${displayCount}`
      );
      const data = await res.json();
      set({ searchedMovies: data.movies, loadedMovies: true });
    } catch (e) {
      console.error(e);
    }
  },
  initializeSearchedMovies: (movies) => {
    set({ searchedMovies: movies, loadedMovies: false });
  },
  clearSearchedMovies: () => {
    set({ searchedMovies: [], loadedMovies: false });
  },

  fetchLikedContents: async (type: string) => {
    set({ loadedLikedBooks: false, loadedLikedMovies: false });

    const res = await fetch(`/api/mypage/bookmarks/${type}`);
    const data: LikedContent[] = await res.json();

    if (type === "book") {
      set({ likedBooks: data, loadedLikedBooks: true });
    } else if (type === "movie") {
      get().setLikedMovies(data);
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
    const res = await fetch(`/api/mypage/bookmarks/${contentType}/${id}`, {
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
    const res = await fetch(`/api/mypage/bookmarks/${contentType}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.checked;
  },
  fetchBookmarkedContent: async (contentType, id) => {
    const res = await fetch(`/api/mypage/bookmarks/${contentType}/${id}`);
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
  setQuery: (item) =>
    set({ query: item, loadedBooks: true, loadedMovies: true }),
  setLikedBooks: (books) =>
    set({
      likedBooks: books,
    }),
  resetDashboardData: () => {
    set(initialState);
  },
});

export type DashboardSlice = State & Actions;
export default createDashboardSlice;
