
export class PaginationData {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  url: string | false;

  constructor(limit?: number, currentPage?: number) {
    this.currentPage = currentPage ? currentPage : 1;
  }
}
