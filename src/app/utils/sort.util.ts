import { SortBy } from '@app/types/common.type';

export abstract class SortUtil {
  static buildSortParam = (sort?: SortBy): Record<string, string> => {
    if (sort?.key && sort?.direction) {
      return {
        sortBy: sort.key,
        direction: sort.direction,
      };
    }

    return {};
  };
}
