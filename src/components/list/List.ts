import { Component, useState, xml } from '@odoo/owl';
import Item from '@/components/list/Item';
import VirtualList, { ItemHeight, Position } from '@/components/list/VirtualList';
import classNames from 'classnames';
import { getPrefixCls } from '@/components/_util/utils';
import { baseProps, BaseProps } from '@/common/baseProps';
import './style/list.scss';
import { SizeType } from '@/components/_util/type';
import { useCompRef, useImperativeHandle } from '@/hooks/useImperativeHandle';

type Props = {
    size?: SizeType,
    bordered?: boolean, // 是否有边框
    className?: string, // 类名
    itemClassName?: (item: any, index: number) => string, // 每一项的类名
    dataSource: any[], // 数据源
    virtual?: boolean, // 是否开启虚拟列表
    height?: number, // virtual为true时设置，列表的高度，如果不设置则为container高度的100%
    itemHeight?: number | ItemHeight, // virtual为true时设置，每一项的高度
    onScroll?: (event: MouseEvent, position: Position) => void // virtual为true时设置，滚动时触发
} & BaseProps;

const listClass = getPrefixCls('list');
const listHeadClass = getPrefixCls('list-head');
const listContainerClass = getPrefixCls('list-container');
const listFooterClass = getPrefixCls('list-footer');
const listItemClass = getPrefixCls('list-item');
const vrListItemClass = getPrefixCls('vr-list-item');

class List extends Component<Props> {
    static components = { Item, VirtualList };

    static props = {
        className: { type: String, optional: true },
        itemClassName: { type: Function, optional: true },
        bordered: { type: Boolean, optional: true },
        size: { type: String, optional: true },
        dataSource: { type: Array, optional: true },
        virtual: { type: Boolean, optional: true },
        height: { type: Number, optional: true },
        itemHeight: { type: [Number, Function], optional: true },
        onScroll: { type: Function, optional: true },
        ...baseProps
    };

    static defaultProps = {
        dataSource: [],
        bordered: false
    };

    static template = xml`
<div t-att-class="getClasses()">
    <t t-if="hasHeader()">
        <div class="${listHeadClass}">
            <t t-slot="header"/>
        </div>
    </t>
    
    <div class="${listContainerClass}">
        <t t-if="showItems()">
            <t t-if="props.virtual">
                <VirtualList ref="virRef" onScroll.bind="onScroll" list="props.dataSource" itemHeight="props.itemHeight" height="props.height">
                    <t t-set-slot="item" t-slot-scope="scope">
                        <div t-att-class="getItemClasses()" t-att-style="scope.style">
                            <t t-slot="item" t-props="scope"/>
                        </div>
                    </t>
                </VirtualList>
            </t>
            <div t-else="" t-att-class="getItemClasses(item, item_index)" t-foreach="props.dataSource" t-as="item" t-key="item_index">
                <t t-slot="item" data="item" index="item_index"/>
            </div>
        </t>
    </div>
    
    <t t-if="hasFooter()">
        <div class="${listFooterClass}">
            <t t-slot="footer"/>
        </div>
    </t>
</div>   
    `;

    state = useState({});
    virRef = useCompRef();

    protected hasHeader() {
        return !!this.props.slots?.header;
    }

    protected hasFooter() {
        return !!this.props.slots?.footer;
    }

    protected showItems() {
        return !!this.props.slots?.item;
    }

    protected getClasses() {
        const { className, bordered, size, virtual } = this.props;
        const hasAnySlot = this.hasFooter() || this.hasHeader() || this.showItems();

        return classNames(className, listClass, {
            [`${listClass}-borderless`]: !bordered || !hasAnySlot,
            [`${listClass}-sm`]: size === 'small',
            [`${listClass}-lg`]: size === 'large',
            [`${listClass}-vt`]: !!virtual
        });
    }

    protected getItemClasses(item: any, index: number) {
        return classNames(listItemClass, this.props.itemClassName?.(item, index), {
            [vrListItemClass]: !!this.props.virtual
        });
    }

    protected onScroll(event: MouseEvent, position: Position) {
        this.props.onScroll?.(event, position);
    }

    public setup(): void {
        useImperativeHandle({
            scrollTo: (index: number) => this.virRef.current?.scrollTo(index)
        });
    }
}

export default List;
