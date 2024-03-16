import { SortBy } from '@app/types/common.type';
import { FlatFilter } from '@ui/types';
import { isEmpty } from 'lodash-es';
import qs from 'query-string';

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

  static buildSearchParam = (search?: string): Record<string, string> => {
    if (search) {
      return {
        search,
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

  static buildFilterParam = (filters?: FlatFilter): { filter?: string } => {
    if (isEmpty(filters)) {
      return {};
    }
    return {
      filter: qs.stringify(filters, {
        arrayFormat: 'separator',
        encode: true,
        arrayFormatSeparator: ':',
      }),
    };
  };
}
