import { SortBy } from '@app/types/common.type';

export abstract class QueryParamUtil {
  static buildSortParam = (sort?: SortBy): Record<string, string> => {
    if (sort?.key && sort?.direction) {
      return {
        sortBy: sort.key,
        direction: sort.direction,
      };
    }

    return {};
  };

  static buildPaginationParam = (pagination?: {
    offset: number;
    limit: number;
  }): Record<string, string> => {
    if (pagination) {
      return {
        offset: pagination.offset.toString(),
        limit: pagination.limit.toString(),
      };
    }

    return {};
  };
}
