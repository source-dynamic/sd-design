import { Component, useComponent, useEffect, useRef, useState, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls, getSDSVG, stylesToString } from '@/components/_util/utils';
import _downSVG from '@/assets/down.svg';
import _searchSVG from '@/assets/search.svg';
import _emptySVG from '@/assets/empty.svg';
import _closeSVG from '@/assets/close.svg';
import _loadingSVG from '@/assets/loading-line.svg';
import classNames from 'classnames';
import List from '@/components/list/List';
import Trigger from '@/components/trigger/trigger';
import './style/select.scss';
import { useEventListener } from '@/hooks/useEventListener';
import { useCompRef } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import { useColsSearch } from '@/hooks/useColsSearch';
import { SizeType } from '@/components/_util/type';
import { useCancellableTimer } from '@/hooks/useCancellableTimer';

const downSVG = getSDSVG(_downSVG, {
    width: '1em',
    height: '1em'
});

const searchSVG = getSDSVG(_searchSVG, {
    width: '1em',
    height: '1em'
});

const emptySVG = getSDSVG(_emptySVG, {
    width: '64',
    height: '41'
});

const loadingSVG = getSDSVG(_loadingSVG, {
    width: '1em',
    height: '1em'
});

const closeSVG = getSDSVG(_closeSVG, {
    width: '1em',
    height: '1em'
});

type Value<T> = T | T[];

type Props = {
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    listHeight?: number;
    disabled?: boolean;
    multiple?: boolean;
    value?: Value<string> | Value<number>;
    defaultValue?: Value<string> | Value<number>;
    size: SizeType,
    bordered?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    popupClassName?: string;
    popupMatchSelectWidth?: boolean;
    showSearch?: boolean;
    onSearch?: (value: string) => boolean;
    options: Option[];
    loading?: boolean;
    open?: boolean;
    maxTagCount?: number | 'responsive'
} & BaseProps;

const selectClass = getPrefixCls('select');
const selectIconClass = getPrefixCls('select-icon');
const selectRotateIconClass = getPrefixCls('select-rotate-icon');
const selectSelectorClass = getPrefixCls('select-selector');
const selectDropdownClass = getPrefixCls('select-dropdown');
const dropdownEmptyClass = getPrefixCls('select-dropdown-empty');
const selectDropdownItemWrapperClass = getPrefixCls('select-dropdown-item-wrapper');
// 需要额外包裹一层，因为item最外层有padding，点击事件到达不了，影响体验
const selectDropdownItemClass = getPrefixCls('select-dropdown-item');
const searchSpanClass = getPrefixCls('select-search-span');
const displaySpanClass = getPrefixCls('select-display-span');
const displayTagClass = getPrefixCls('select-display-span-tag');

export type Option = {
    label: string;
    value: number | string;
};

type State = {
    searchValue: string;
    triggerNode?: HTMLElement;
    focus: boolean;
};

class Select extends Component<Props> {
    static components = { List, Trigger };

    static props = {
        getPopupContainer: { type: Function, optional: true },
        listHeight: { type: Number, optional: true },
        disabled: { type: Boolean, optional: true },
        value: { type: [String, Array, Number], optional: true },
        defaultValue: { type: [String, Array, Number], optional: true },
        multiple: { type: Boolean, optional: true },
        size: { type: String, optional: true },
        bordered: { type: Boolean, optional: true },
        defaultOpen: { type: Boolean, optional: true },
        autoFocus: { type: Boolean, optional: true },
        popupClassName: { type: String, optional: true },
        popupMatchSelectWidth: { type: Boolean, optional: true },
        showSearch: { type: Boolean, optional: true },
        onSearch: { type: Function, optional: true },
        options: { type: Array },
        loading: { type: Boolean, optional: true },
        open: { type: Boolean, optional: true },
        maxTagCount: { type: [Number, String], optional: true},
        ...baseProps
    };

    static defaultProps = {
        listHeight: 256,
        popupMatchSelectWidth: true,
        multiple: true,
        maxTagCount: 3,
        defaultValue: Array.from({ length: 20 }, (_, index) => `value${index}`) // todo: 删除
    };

    state = useState<State>({
        searchValue: '',
        focus: this.props.autoFocus || false,
        triggerNode: undefined,
    });

    controllableState = useControllableState<{ value?: Value<string> | Value<number>, open?: boolean }>(this.props, {
        value: this.props.defaultValue,
        open: false
    });

    colsState = useColsSearch(this.props.options);

    cancelableTimer = useCancellableTimer();

    containerRef = useRef('container');

    triggerRef = useCompRef();

    static template = xml`
<span t-ref="container" t-att-class="getClass()" t-on-click="onClickContainer">
    <span class="${selectSelectorClass}">
        <t t-set="searchClass" t-value="getSearchClass()"/>
        <t t-if="props.multiple">
            <span t-att-class="searchClass.display">
                <t t-foreach="controllableState.state.value" t-as="value" t-key="value">
                    <span class="${displayTagClass}"><t t-esc="display(value)"/>${closeSVG}</span>
                </t>
                <t t-if="props.showSearch">
                    <span t-att-class="searchClass.search"><input t-on-input="onInput" t-att-value="state.searchValue" type="text"/></span>
                </t>
            </span>
        </t>
        <t t-else="">
            <t t-if="props.showSearch">
                <span t-att-class="searchClass.search"><input t-on-input="onInput" t-att-value="state.searchValue" type="text"/></span>
            </t>
            <span t-att-class="searchClass.display">
                <t t-esc="display(controllableState.state.value)"/>
            </span>
        </t>
    </span>
    <Trigger ref="triggerRef" className="getPopupClass()" isOpen="controllableState.state.open" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" getStyle.bind="getDropdownStyle">
        <t t-if="colsState.state.displayCols.length === 0">
            <t t-slot="empty">
                <div class="${dropdownEmptyClass}">
                    <div>${emptySVG}</div>
                    <div>暂无数据</div>
                </div>
            </t>
        </t>
        <t t-else="">
            <List dataSource="colsState.state.displayCols" itemClassName.bind="getItemClass">
                <t t-set-slot="item" t-slot-scope="scope">
                    <div class="${selectDropdownItemClass}" t-on-click.synthetic="() => this.onChoice(scope.data)">
                        <t t-esc="scope.data.label"/>
                    </div>
                </t>
            </List>        
        </t>
    </Trigger>
    <span class="${selectIconClass}">
        <t t-if="props.loading"><span class="${selectRotateIconClass}">${loadingSVG}</span></t>
        <t t-elif="state.searchValue">${searchSVG}</t>
        <t t-else="">${downSVG}</t>
    </span>
 </span>   
    `;

    protected onInput(event: Event) {
        const value = (event.currentTarget as HTMLInputElement).value;
        this.state.searchValue = value;
        this.colsState.state.searchValue = value;
        this.props.onSearch?.(value);
    }

    protected clear() {
        this.state.searchValue = '';
        this.colsState.state.searchValue = '';
    }

    protected timerClear() {
        // 先清空searchValue使展示正常
        this.state.searchValue = '';
        this.cancelableTimer.run(this.clear.bind(this), 1000);
    }

    protected onClickContainer(event: MouseEvent) {
        // 如果已经open并且允许search，则不进行关闭
        if (this.controllableState.state.open && this.props.showSearch) {
            return;
        }
        this.toggleOpen();
    }

    /**
     * 切换下拉框的显示状态
     * @param force 切换状态
     * @protected
     */
    protected toggleOpen(force?: boolean) {
        if (!this.props.disabled) {
            this.state.focus = true;
            this.controllableState.setState({
                open: force ?? !this.controllableState.state.open
            });
            if (this.controllableState.state.open) {
                this.clear();
                this.cancelableTimer.cancel();
                this.state.triggerNode = this.containerRef.el!;
            }
        }
    }

    /**
     * select组件的样式类
     * @protected
     */
    protected getClass() {
        const { size, disabled, bordered } = this.props;

        return classNames(selectClass, {
            [`${selectClass}-borderless`]: !bordered,
            [`${selectClass}-focus`]: this.state.focus,
            [`${selectClass}-multiple`]: !!this.props.multiple,
            [`${selectClass}-isOpen`]: this.controllableState.state.open,
            [`${selectClass}-disabled`]: !!disabled,
            [`${selectClass}-sm`]: size === 'small',
            [`${selectClass}-lg`]: size === 'large',
            [`${selectClass}-vir`]: false
        });
    }

    protected getSearchClass() {
        return {
            search: classNames(searchSpanClass, {
                [`${searchSpanClass}-multiple`]: !!this.props.multiple
            }),
            display: classNames(displaySpanClass, {
                [`${selectClass}-v-hidden`]: !this.props.multiple && !!this.state.searchValue  // 多选模式下不隐藏
            })
        };
    }

    protected getPopupClass() {
        return classNames(selectDropdownClass, this.props.popupClassName);
    }

    protected getItemClass(item: Option, index: number) {
        return classNames(selectDropdownItemWrapperClass, {
            [`${selectDropdownItemClass}-selected`]: item.value === this.controllableState.state.value
        });
    }

    /**
     * 下拉框的样式
     * @param triggerNode
     * @protected
     */
    protected getDropdownStyle(triggerNode?: HTMLElement) {
        if (!triggerNode) {
            return;
        }

        const { clientWidth } = triggerNode;
        const style = {
            'max-height': `${this.props.listHeight}px`
        };
        if (this.props.popupMatchSelectWidth) {
            style['width'] = `${clientWidth}px`;
        }

        return stylesToString(style);
    }

    /**
     * 点击外部区域时，关闭下拉框
     * @param event
     * @protected
     */
    protected onClickOutsideHandler(event: MouseEvent) {
        const target = event.target as HTMLElement;
        // 在点击非选择框区域和非选项区域时，关闭下拉框
        if (!this.containerRef.el?.contains(target) && !this.triggerRef.current?.wrapperRef.el?.contains(target)) {
            if (this.controllableState.state.open) {
                this.controllableState.setState({
                    open: false
                });
            }
            this.state.focus = false;
            // 先清空searchValue使展示正常
            this.timerClear();
        }
    }

    protected onChoice(data: Option) {
        this.controllableState.setState({
            value: data.value
        });
        if (!this.props.multiple) {
            this.timerClear();
            this.controllableState.setState({
                open: false
            });
        }
    }

    /**
     * 回显逻辑
     * @param value
     * @protected
     */
    protected display(value: string | number) {
        return this.props.options.find((c) => c.value === value)?.label || '';
    }

    public setup(): void {
        const component = useComponent();
        const target = { el: window };
        useEventListener(target, 'mousedown', this.onClickOutsideHandler);

        useEffect(() => {
            this.colsState.state.columns = this.props.options;
        }, () => [this.props.options]);

        // 是否默认展开逻辑
        useEffect(() => {
            if (this.props.defaultOpen && !this.props.disabled) {
                this.state.triggerNode = this.containerRef.el!;
                this.controllableState.setState({
                    open: true
                });
            }
        }, () => []);
    }
}

export default Select;
