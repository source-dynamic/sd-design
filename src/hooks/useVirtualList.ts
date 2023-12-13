import { useComponent, useEffect, useState } from '@odoo/owl';

type ItemHeight<T> = (index: number, data: T) => number;

type Options<T> = {
    containerTarget: Element;  // 外面容器，DOM节点
    wrapperTarget: Element;  // 内部容器，DOM节点
    itemHeight: number | ItemHeight<T>;  // 行高度，静态高度可以直接写入像素值，动态高度可传入函数
    overscan?: number;  // 视区上、下额外展示的 DOM 节点数量
}

export const useVirtualList = <T = any> (list: T[], options: Options<T>) => {
    const component = useComponent();

    const { containerTarget, wrapperTarget, itemHeight, overscan = 5 } = options;

    const state = useState({
        scrollTriggerByScrollToFunc: false,  // 是否是 scrollTo 方法触发的滚动
        targetList: list,  // 当前可见区域内列表项
    })

    useEffect(() => {
        console.log(component.props);
    }, () => [component.props]);

    return {
        list: state.targetList
    };
}
