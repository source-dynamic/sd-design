import { useEffect, useState } from '@odoo/owl';

export type Column = {
    value: number | string;
    label: string;
};

export type State = {
    columns: Column[];
    displayCols: Column[];
    selectedValue: string[];
    searchValue: string;
    allSelected: boolean;
};

/**
 * 带搜索的指定列表项使用的state，根据搜索项过滤返回过滤后的列表项，提供全选和反选功能
 * @param columns 初始列表项
 * @param filter  筛选函数
 * @param filterSort 排序对比函数
 */
export const useColsSearch = (columns?: Column[], filter?: (sValue: string, col: Column) => boolean, filterSort?: (colA: Column, colB: Column) => number, ) => {
    /**
     * 根据搜索值过滤列，匹配label，模糊匹配
     * @param columns
     * @param searchValue
     */
    const filterColumns = (columns: Column[], searchValue: string): Column[] => {
        return columns.filter((c) => {
            if (filter) {
                return filter(searchValue, c)
            }

            return c.label.indexOf(searchValue) !== -1
        });
    };

    const state = useState<State>({
        columns: columns ?? [],
        displayCols: [],
        selectedValue: [],
        searchValue: '',
        allSelected: false
    });

    /**
     * 根据当前已选中值进行全选或取消全选，都是针对当前搜索结果进行的操作
     * @param isAll 全选或取消全选
     */
    const selectAll = (isAll: boolean): void => {
        const allValues = state.displayCols.map((v) => (v.value.toString()));
        if (!state.searchValue) {
            state.selectedValue = isAll ? allValues : [];
        } else {
            // 已经被选中的值
            const sourceSelectedValues = [...state.selectedValue];
            // 全选求并集，取消全选求差集
            const allIdsSet = new Set(allValues);
            state.selectedValue = isAll
                ? Array.from(new Set(sourceSelectedValues.concat(allValues)))
                : sourceSelectedValues.filter(cid => !allIdsSet.has(cid));
        }
    };

    useEffect(() => {
        let filterCols = filterColumns(state.columns, state.searchValue);
        if (filterSort) {
            filterCols = filterCols.sort(filterSort)
        }
        state.displayCols = filterCols;
    }, () => [state.columns, state.searchValue]);

    // 根据选中值和待选项判断是否全选
    useEffect(() => {
        // displayCols和selectedValue的交集数量等于displayCols则为全选
        const selectedSet = new Set(state.selectedValue);
        const intersection = state.displayCols.filter((col) => selectedSet.has(String(col.value)));
        state.allSelected = intersection.length >= state.displayCols.length;
    }, () => [state.selectedValue, state.displayCols]);

    return {
        state,
        selectAll
    };
};
