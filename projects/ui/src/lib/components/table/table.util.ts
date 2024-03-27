import { isNil, isNumber, isString } from 'lodash-es';
import { TableColumnConfig } from './table.types';

export abstract class TableUtil {
  public static getGridTemplateColumns(
    columns: TableColumnConfig[],
    tableWidthInPx: number,
  ): string {
    const widthsMap = new Map<string, string>();

    let availableTableWidthInPx = tableWidthInPx;
    const colWithDynamicWidth = columns.filter((col) => isNil(col.width));

    columns.forEach((col) => {
      if (isString(col.width)) {
        const widthInPx = this.#getNumberFromWidth(col.width);
        const widthOfCol = Math.max(widthInPx, col.minWidthInPx ?? 0);
        widthsMap.set(col.id, col.width);
        availableTableWidthInPx -= widthOfCol;
      } else if (isNumber(col.width)) {
        const widthInPxForPercentage =
          (availableTableWidthInPx * col.width) / 100;
        const widthOfCol = Math.max(
          widthInPxForPercentage,
          col.minWidthInPx ?? widthInPxForPercentage,
        );
        widthsMap.set(col.id, `${widthOfCol}px`);
        availableTableWidthInPx -= widthOfCol;
      } else {
        // Push the placeholder value to the map inorder to preserver the order of columns
        widthsMap.set(col.id, 'auto');
      }
    });

    // Preserve some space for scrollbar
    const widthOfScrollbar = 16;
    availableTableWidthInPx -= widthOfScrollbar;

    colWithDynamicWidth.forEach((col) => {
      const resolvedWidth =
        availableTableWidthInPx / colWithDynamicWidth.length;
      const minWidthLargest = Math.max(col.minWidthInPx ?? 0, resolvedWidth);

      const minWidth = minWidthLargest > 0 ? `${minWidthLargest}px` : '0px';

      widthsMap.set(col.id, `minmax(${minWidth}, auto)`);
    });

    return Array.from(widthsMap.values()).join(' ');
  }

  static #getNumberFromWidth(width?: string | number): number {
    return !isNil(width)
      ? isString(width)
        ? parseInt(width.replace('px', ''))
        : width
      : 0;
  }
}
