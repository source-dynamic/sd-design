import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import { useSize } from '@/hooks/useSize';
import { isNumber } from '@/components/_util';
import { stylesToString } from '@/components/_util/utils';
import { useEventListener } from '@/hooks/useEventListener';
import { useImperativeHandle } from '@/hooks/useImperativeHandle';
import { BaseProps } from '@/common/baseProps';

type ItemHeight = (index: number, data: any) => number;

type Props = {
    list: any[],
    itemHeight: number | ItemHeight,
    overscan?: number
} & BaseProps;

type TargetData = {
    index: number,
    data: any
}

type State = {
    scrollTriggerByScrollToFunc: boolean,
    targetList: TargetData[],
    wrapperStyle?: string
}

class VirtualList extends Component<Props> {
    static defaultProps = {
        overscan: 5
    };

    static template = xml`
<div t-ref="container" style="height: 300px; overflow: auto">
    <div t-ref="wrapper" t-att-style="state.wrapperStyle">
        <t t-foreach="state.targetList" t-as="item" t-key="item.index">
            <t t-slot="renderItem" item="item.data" index="item.index" style="item.style">
                <div><t t-esc="item.index"></t></div>
            </t>
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
        wrapperStyle: undefined
    });

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

        useEventListener(this.containerRef, 'scroll', (event) => {
            if (this.state.scrollTriggerByScrollToFunc) {
                // 如果是 scrollTo 方法触发的滚动，则不再触发计算
                this.state.scrollTriggerByScrollToFunc = false;
                return;
            }
            event.preventDefault();
            this.calculateRange();
        });

        useEffect(() => {
            if (!this.size.width || !this.size.height) return;
            this.calculateRange();
        }, () => [this.size.width, this.size.height, this.props.list]);
    }
}

export default VirtualList;
