import { PaginationDto } from './pagination.dto';

export const paginate = (total: number, page: number, limit: number): PaginationDto => {
  const totalPages = Math.ceil(total / limit);
  const next = page < totalPages ? page + 1 : null;
  const previous = page > 1 ? page - 1 : null;
  return { total, next, previous };
};
