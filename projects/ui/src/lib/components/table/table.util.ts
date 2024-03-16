import { isNil, isNumber, isString } from 'lodash-es';
import { TableColumnConfig } from './table.types';

export abstract class TableUtil {
  static getGridTemplateColumns(
    columns: TableColumnConfig[],
    tableWidthInPx: number,
  ): string {
    const widthsInPx: {
      id: string;
      widthInPx?: number;
    }[] = [];
    let availableTableWidthInPx = tableWidthInPx;
    const colWithDynamicWidth = columns.filter((col) => isNil(col.width));

    columns.forEach((col) => {
      if (isString(col.width)) {
        const widthInPx = this.getNumberFromWidth(col.width);
        const widthOfCol = Math.max(widthInPx, col.minWidthInPx ?? 0);
        widthsInPx.push({ widthInPx: widthOfCol, id: col.id });
        availableTableWidthInPx -= widthOfCol;
      } else if (isNumber(col.width)) {
        const widthInPxForPercentage =
          (availableTableWidthInPx * col.width) / 100;
        const widthOfCol = Math.max(
          widthInPxForPercentage,
          col.minWidthInPx ?? 0,
        );
        widthsInPx.push({
          widthInPx: widthOfCol,
          id: col.id,
        });
        availableTableWidthInPx -= widthOfCol;
      } else {
        widthsInPx.push({
          id: col.id,
        });
      }
    });

    colWithDynamicWidth.forEach((col) => {
      const minWidthInPx = col.minWidthInPx ?? 0;
      const resolvedWidth =
        availableTableWidthInPx / colWithDynamicWidth.length;
      widthsInPx.find((colInPx) => colInPx.id === col.id)!.widthInPx = Math.max(
        resolvedWidth,
        minWidthInPx,
      );
    });

    return widthsInPx.map((width) => `${width.widthInPx}px`).join(' ');
  }

  private static getNumberFromWidth(px?: string | number): number {
    return !isNil(px)
      ? isString(px)
        ? parseInt(px.replace('px', ''))
        : px
      : 0;
  }
}
