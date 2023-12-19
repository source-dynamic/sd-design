import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import { useSize } from '@/hooks/useSize';
import { isNumber } from '@/components/_util';
import { getPrefixCls, stylesToString } from '@/components/_util/utils';
import { useEventListener } from '@/hooks/useEventListener';
import { useImperativeHandle } from '@/hooks/useImperativeHandle';
import { baseProps, BaseProps } from '@/common/baseProps';
import { MouseEvent } from 'react';
import classNames from 'classnames';

export type ItemHeight = (index: number, data: any) => number;

export type Position = 'start' | 'end' | 'mid';

type Props = {
    className?: string,
    list: any[],
    height?: number,
    itemHeight: number | ItemHeight,
    overscan?: number,
    onScroll?: (event: MouseEvent, position: Position) => void
} & BaseProps;

type TargetData = {
    index: number,
    data: any
}

type State = {
    scrollTriggerByScrollToFunc: boolean,
    targetList: TargetData[],
    wrapperStyle?: string,
    containerHeight: number
}

const VirtualListClass = getPrefixCls('vir-list');
const VirtualListWrapperClass = getPrefixCls('vir-list-wrapper');

class VirtualList extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        list: { type: Array },
        height: { type: Number, optional: true },
        itemHeight: { type: [Number, Function] },
        overscan: { type: Number, optional: true },
        onScroll: { type: Function, optional: true },
        ...baseProps
    };

    static defaultProps = {
        overscan: 5
    };

    static template = xml`
<div t-att-class="getClass()" t-ref="container" t-att-style="getStyle()">
    <div t-ref="wrapper" t-att-style="state.wrapperStyle" class="${VirtualListWrapperClass}">
        <t t-foreach="state.targetList" t-as="target" t-key="target.index">
            <t t-slot="item" data="target.data" index="target.index" style="target.style"/>
        </t>
    </div>
</div>   
    `;

    containerRef = useRef<HTMLDivElement>('container');
    wrapperRef = useRef<HTMLDivElement>('wrapper');
    size = useSize('container');

    state = useState<State>({
        scrollTriggerByScrollToFunc: false,
        targetList: [],
        wrapperStyle: undefined,
        containerHeight: 0
    });

    protected getClass() {
        return classNames(VirtualListClass, this.props.className);
    }

    protected getStyle() {
        const { height } = this.props;
        const style = {
            overflow: 'auto',
            'overflow-anchor': 'none'
        };
        // 如果有指定高度，则设置max-height，否则height设为100%
        // max-height可以达到在不需要滚动时，高度自适应的效果
        if (isNumber(height)) {
            style['max-height'] = `${height}px`;
        } else {
            style['height'] = '100%';
        }
        return stylesToString(style);
    }

    protected getTotalHeight() {
        const { itemHeight } = this.props;
        if (isNumber(itemHeight)) {
            // 如果是固定高度，则直接计算
            return this.props.list.length * itemHeight;
        }
        let sum = 0;
        for (let i = 0; i < this.props.list.length; i++) {
            const item = this.props.list[i];
            const height = itemHeight(i, item);
            sum += height;
        }
        return sum;
    }

    /**
     * 获取当前的数据偏移量，注：指向的下一个数据索引
     * @param scrollTop 滚动条距离顶部的距离
     * @protected
     */
    protected getOffset(scrollTop: number): number {
        const { itemHeight } = this.props;
        if (isNumber(itemHeight)) {
            // 如果是固定高度，则直接计算
            return Math.ceil(scrollTop / itemHeight);
        }

        let sum = 0;
        let offset = 0;
        for (let i = 0; i < this.props.list.length; i++) {
            const item = this.props.list[i];
            const height = itemHeight(i, item);
            sum += height;
            if (sum >= scrollTop) {
                offset = i;
                break;
            }
        }
        return offset + 1;
    }

    /**
     * 获取可视区域内的数据数量
     * @param clientHeight
     * @param fromIndex
     * @protected
     */
    protected getVisibleCount(clientHeight: number, fromIndex: number): number {
        const { itemHeight } = this.props;
        if (isNumber(itemHeight)) {
            // 如果是固定高度，则直接计算
            return Math.ceil(clientHeight / itemHeight);
        }
        let sum = 0;
        let endIndex = 0;
        for (let i = fromIndex; i < this.props.list.length; i++) {
            const item = this.props.list[i];
            const height = itemHeight(i, item);
            sum += height;
            endIndex = i;
            if (sum >= clientHeight) {
                break;
            }
        }
        return endIndex - fromIndex;
    }

    /**
     * 计算指定索引的数据距离顶部的距离
     * @param index
     * @protected
     */
    protected getDistanceTop(index: number): number {
        const { itemHeight } = this.props;
        if (isNumber(itemHeight)) {
            // 如果是固定高度，则直接计算
            return index * itemHeight;
        }
        let sum = 0;
        for (let i = 0; i < index; i++) {
            const item = this.props.list[i];
            const height = itemHeight(i, item);
            sum += height;
        }
        return sum;
    }

    /**
     * 计算可视区域内的数据
     * @protected
     */
    protected calculateRange() {
        const { overscan, itemHeight } = this.props;
        const container = this.containerRef.el;
        if (container) {
            const { scrollTop, clientHeight } = container;
            const offset = this.getOffset(scrollTop);
            const visibleCount = this.getVisibleCount(clientHeight, offset);
            const start = Math.max(0, offset - overscan!);
            const end = Math.min(this.props.list.length, offset + visibleCount + overscan!);
            const offsetTop = this.getDistanceTop(start);
            const totalHeight = this.getTotalHeight();
            this.state.containerHeight = clientHeight;
            this.state.wrapperStyle = stylesToString({
                height: `${totalHeight - offsetTop}px`,
                'margin-top': `${offsetTop}px`
            });
            this.state.targetList = this.props.list.slice(start, end).map((data, index) => ({
                index: start + index,
                data,
                style: stylesToString({
                    height: isNumber(itemHeight) ? `${itemHeight}px` : `${itemHeight(start + index, data)}px`
                })
            }));
        }
    }

    protected scrollTo(index: number) {
        if (this.containerRef.el) {
            this.state.scrollTriggerByScrollToFunc = true;
            this.containerRef.el.scrollTop = this.getDistanceTop(index);
            this.calculateRange();
        }
    };

    public setup(): void {
        useImperativeHandle({
            scrollTo: this.scrollTo.bind(this)
        });

        useEventListener(this.containerRef, 'scroll', (event: MouseEvent) => {
            if (this.state.scrollTriggerByScrollToFunc) {
                // 如果是 scrollTo 方法触发的滚动，则不再触发计算
                this.state.scrollTriggerByScrollToFunc = false;
                return;
            }
            event.preventDefault();
            this.calculateRange();
            let position: Position = 'mid';
            if (event.currentTarget.scrollTop === 0) {
                position = 'start';
            } else if (event.currentTarget.scrollHeight - event.currentTarget.scrollTop === this.state.containerHeight) {
                // 可滚动总高度 - 滚动条距离顶部的距离 和 容器高度相等表示滚动到底部
                position = 'end';
            }

            this.props.onScroll?.(event, position);
        });

        useEffect(() => {
            this.calculateRange();
        }, () => [this.size.width, this.size.height, this.props.list]);
    }
}

export default VirtualList;
