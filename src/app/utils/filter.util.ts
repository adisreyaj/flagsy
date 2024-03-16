import { FilterWithSelection } from '@ui/components';
import { FlatFilter } from '@ui/types';
import { toLower } from 'lodash-es';

export class FilterUtil {
  static convertToFlatFilter = (
    filters?: FilterWithSelection[],
  ): FlatFilter => {
    return (filters ?? []).reduce((acc, filter) => {
      return {
        ...acc,
        [toLower(filter.filter.field)]: Array.from(filter.selectedValues).map(
          String,
        ),
      };
    }, {});
  };
}
