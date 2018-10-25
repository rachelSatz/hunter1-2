export class PaginationData {
  totalPages: number;
  totalItems: number;
  limit: number;
  currentPage: number;
  url: string | false;

  constructor(limit?: number, currentPage?: number) {
    this.limit = limit ? limit : 30;
    this.currentPage = currentPage ? currentPage : 1;
  }
}
