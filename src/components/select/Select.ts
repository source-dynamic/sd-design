import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls, getSDSVG, stylesToString } from '@/components/_util/utils';
import _downSVG from '@/assets/down.svg';
import _searchSVG from '@/assets/search.svg';
import _emptySVG from '@/assets/empty.svg';
import _loadingSVG from '@/assets/loading-line.svg';
import _checkSVG from '@/assets/check.svg';
import classNames from 'classnames';
import List from '@/components/list/List';
import Trigger, { Placement } from '@/components/trigger/Trigger';
import './style/select.scss';
import { useEventListener } from '@/hooks/useEventListener';
import { useCompRef, useImperativeHandle } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import { useColsSearch } from '@/hooks/useColsSearch';
import { SizeType } from '@/components/_util/type';
import { useCancellableTimer } from '@/hooks/useCancellableTimer';
import { useResizeObserver } from '@/hooks/useSizeObserver';
import Overflow, { Option } from '@/components/select/Overflow';
import _closeSVG from '@/assets/close_fill.svg';
import { ItemHeight, Position } from '@/components/list/VirtualList';

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

const checkSVG = getSDSVG(_checkSVG, {
    width: '1em',
    height: '1em'
});

const closeSVG = getSDSVG(_closeSVG, {
    width: '1em',
    height: '1em'
});

type Value<T> = T | T[];

type Props = {
    className?: string;
    allowClear?: boolean;
    autoClearSearchValue?: boolean;
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    placement?: Placement;
    listHeight?: number;
    disabled?: boolean;
    multiple?: boolean;
    value?: Value<string> | Value<number>;
    defaultValue?: Value<string> | Value<number>;
    size: SizeType,
    placeholder?: string;
    bordered?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
    popupClassName?: string;
    popupMatchSelectWidth?: boolean;
    destroyOnHide?: boolean;
    showSearch?: boolean;
    filterOption?: (searchValue: string, option: Option) => boolean;
    filterSort?: (optionA: Option, optionB: Option) => number;
    options: Option[];
    loading?: boolean;
    open?: boolean;
    maxTagCount?: number | 'responsive';
    virtual?: boolean;
    itemHeight?: number | ItemHeight;
    onSearch?: (value: string) => boolean;
    onSelect?: (option: Option) => void;
    onDeselect?: (option: Option) => void;
    onClear?: () => void;
    onDropdownVisibleChange?: (open: boolean) => void;
    onFocus?: () => void;
    onPopupScroll?: (event: MouseEvent, position?: Position) => void;
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

type State = {
    searchValue: string;
    triggerNode?: HTMLElement;
    focus: boolean;
    multipleInputStyle?: string
};

class Select extends Component<Props> {
    static components = { List, Trigger, Overflow };

    static props = {
        className: { type: String, optional: true },
        allowClear: { type: Boolean, optional: true },
        autoClearSearchValue: { type: Boolean, optional: true },
        getPopupContainer: { type: Function, optional: true },
        placement: { type: String, optional: true },
        listHeight: { type: Number, optional: true },
        disabled: { type: Boolean, optional: true },
        value: { type: [String, Array, Number], optional: true },
        defaultValue: { type: [String, Array, Number], optional: true },
        multiple: { type: Boolean, optional: true },
        size: { type: String, optional: true },
        placeholder: { type: String, optional: true },
        bordered: { type: Boolean, optional: true },
        defaultOpen: { type: Boolean, optional: true },
        autoFocus: { type: Boolean, optional: true },
        popupClassName: { type: String, optional: true },
        popupMatchSelectWidth: { type: Boolean, optional: true },
        destroyOnHide: { type: Boolean, optional: true },
        showSearch: { type: Boolean, optional: true },
        filterOption: { type: Function, optional: true },
        filterSort: { type: Function, optional: true },
        options: { type: Array },
        loading: { type: Boolean, optional: true },
        open: { type: Boolean, optional: true },
        maxTagCount: { type: [Number, String], optional: true },
        virtual: { type: Boolean, optional: true },
        itemHeight: { type: [Number, Function], optional: true },
        onSearch: { type: Function, optional: true },
        onSelect: { type: Function, optional: true },
        onDeselect: { type: Function, optional: true },
        onClear: { type: Function, optional: true },
        onDropdownVisibleChange: { type: Function, optional: true },
        onFocus: { type: Function, optional: true },
        onPopupScroll: { type: Function, optional: true },
        ...baseProps
    };

    static defaultProps = {
        autoClearSearchValue: true,
        listHeight: 256,
        virtual: false,
        popupMatchSelectWidth: true,
        destroyOnHide: true,
        multiple: false,
        bordered: true,
        placement: 'bottomLeft'
    };

    state = useState<State>({
        searchValue: '',
        focus: this.props.autoFocus || false,
        triggerNode: undefined,
        multipleInputStyle: undefined
    });

    controllableState = useControllableState<{ value?: Value<string> | Value<number>, open?: boolean }>(this.props, {
        value: this.props.defaultValue ?? this.props.multiple ? [] : undefined,
        open: false
    });

    colsState = useColsSearch(this.props.options, this.props.filterOption, this.props.filterSort);

    cancelableTimer = useCancellableTimer();

    containerRef = useRef('container');

    searchTempRef = useRef('searchTemp');

    searchSpanRef = useRef('searchSpan');

    searchRef = useRef('search');

    triggerRef = useCompRef();

    static template = xml`
<span t-ref="container" t-att-class="getClass()" t-on-click="onClickContainer">
    <span class="${selectSelectorClass}">
        <span t-if="showPlaceholder()" class="${selectSelectorClass}-placeholder"><t t-esc="props.placeholder"/></span>
        <div class="${selectSelectorClass}-temp" t-ref="searchTemp"><t t-esc="state.searchValue"/></div>
        <t t-set="searchClass" t-value="getSearchClass()"/>
        <t t-if="props.multiple">
            <Overflow slots="props.slots" className="'${selectSelectorClass}-tags'" values="controllableState.state.value" maxTagCount="props.maxTagCount" options="props.options" handleDelete.bind="handleDeleteChoice">
                <t t-set-slot="suffix">
                    <t t-if="props.showSearch">
                        <span t-att-class="searchClass.search">
                            <span t-ref="searchSpan">
                                <input t-ref="search" t-on-input="onInput" t-att-value="state.searchValue" type="text"/>
                            </span>
                        </span>
                    </t>
                </t>
            </Overflow>
        </t>
        <t t-else="">
            <t t-if="props.showSearch">
                <span t-att-class="searchClass.search"><input t-on-input="onInput" t-att-value="state.searchValue" type="text"/></span>
            </t>
            <t t-set="displayOption" t-value="getOption(controllableState.state.value)"/>
            <span t-if="displayOption" t-att-class="searchClass.display">
                <t t-slot="label" data="displayOption">
                    <t t-esc="displayOption.label"/>
                </t>
            </span>
        </t>
    </span>
    <Trigger ref="triggerRef" onScroll.bind="onScroll" className="getPopupClass()" isOpen="controllableState.state.open" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" destroyOnHide="props.destroyOnHide" getStyle.bind="getDropdownStyle" placement="props.placement">
        <t t-if="colsState.state.displayCols.length === 0">
            <t t-slot="empty">
                <div class="${dropdownEmptyClass}">
                    <div>${emptySVG}</div>
                    <div>暂无数据</div>
                </div>
            </t>
        </t>
        <t t-else="">
            <List dataSource="colsState.state.displayCols" itemClassName.bind="getItemClass" virtual="props.virtual" itemHeight="props.itemHeight" height="props.listHeight" onScroll.bind="onScroll">
                <t t-set-slot="item" t-slot-scope="scope">
                    <div class="${selectDropdownItemClass}" t-on-click.synthetic="() => this.handleChoice(scope.data)">
                        <span>
                            <t t-slot="label" data="scope.data">
                                <t t-esc="scope.data.label"/>
                            </t>
                        </span>
                        <span class="${selectDropdownItemClass}-icon" t-if="this.showSelectedSuffix(scope.data)">${checkSVG}</span>
                    </div>
                </t>
            </List>        
        </t>
    </Trigger>
    <span class="${selectIconClass}">
        <t t-if="props.loading"><span class="${selectRotateIconClass}">${loadingSVG}</span></t>
        <t t-elif="state.searchValue">${searchSVG}</t>
        <t t-else="">${downSVG}</t>
        
        <span t-if="!props.disabled &amp;&amp; props.allowClear" class="${selectIconClass}-clear" t-on-click="handleClear">
            ${closeSVG}
        </span>
    </span>
 </span>   
    `;

    /**
     * 判断是否显示placeholder的逻辑
     * @protected
     */
    protected showPlaceholder() {
        const { multiple } = this.props;
        if (!!this.state.searchValue) {
            return false;
        }

        if (!multiple) {
            return !this.controllableState.state.value;
        }
        return (this.controllableState.state.value as (string | number)[]).length === 0;
    }

    /**
     * 搜索值变化时触发回调
     * @param event
     * @protected
     */
    protected onInput(event: Event) {
        const value = (event.currentTarget as HTMLInputElement).value;
        this.state.searchValue = value;
        this.colsState.state.searchValue = value;
        this.props.onSearch?.(value);
    }

    /**
     * 清空搜索值
     * @protected
     */
    protected clear() {
        this.state.searchValue = '';
        this.colsState.state.searchValue = '';
    }

    /**
     * 延时清空搜索值，但是会马上清空显示的值
     * @protected
     */
    protected timerClear() {
        // 先清空searchValue使展示正常
        this.state.searchValue = '';
        this.cancelableTimer.run(this.clear.bind(this), 1000);
    }

    /**
     * 点击最外层容器时触发的回调
     * @param event
     * @protected
     */
    protected onClickContainer(event: MouseEvent) {
        if (!this.props.disabled) {
            // 打开时如果有searchRef，则进行聚焦，仅multiple有用
            this.searchRef.el?.focus();
            // 如果已经open并且允许search，则不进行关闭
            if (this.controllableState.state.open && this.props.showSearch) {
                return;
            }
            this.toggleOpen();
            this.state.focus = true;
            this.props.onFocus?.();
        }
    }

    /**
     * 下拉框的显示状态改变时触发
     * @param open 是否显示
     * @protected
     */
    protected onDropdownVisibleChange(open: boolean) {
        this.controllableState.setState({
            open
        });
        this.props.onDropdownVisibleChange?.(open);
    }

    /**
     * 切换下拉框的显示状态
     * @param force 切换状态
     * @protected
     */
    protected toggleOpen(force?: boolean) {
        if (!this.props.disabled) {
            this.onDropdownVisibleChange(force ?? !this.controllableState.state.open);
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
        const { size, className, disabled, bordered } = this.props;

        return classNames(className, selectClass, {
            [`${selectClass}-borderless`]: !bordered,
            [`${selectClass}-focus`]: this.state.focus,
            [`${selectClass}-multiple`]: !!this.props.multiple,
            [`${selectClass}-isOpen`]: this.controllableState.state.open,
            [`${selectClass}-searchable`]: this.props.showSearch,
            [`${selectClass}-disabled`]: !!disabled,
            [`${selectClass}-sm`]: size === 'small',
            [`${selectClass}-lg`]: size === 'large',
            [`${selectClass}-vir`]: false
        });
    }

    /**
     * 搜索相关部分的样式
     * @protected
     */
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

    /**
     * 下拉框的class
     * @protected
     */
    protected getPopupClass() {
        return classNames(selectDropdownClass, this.props.popupClassName, {
            [`${selectDropdownClass}-virtual`]: !!this.props.virtual
        });
    }

    /**
     * 选项的样式类
     * @param item
     * @param index
     * @protected
     */
    protected getItemClass(item: Option, index: number) {
        if (!this.props.multiple) {
            return classNames(selectDropdownItemWrapperClass, {
                [`${selectDropdownItemClass}-selected`]: item.value === this.controllableState.state.value
            });
        }

        return classNames(selectDropdownItemWrapperClass, {
            [`${selectDropdownItemClass}-selected`]: (this.controllableState.state.value as (string | number)[]).indexOf(
                item.value) !== -1
        });
    }

    /**
     * 下拉框的样式style
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
     * 判断下拉框中是否显示已选的后缀标识
     * @param option 选项
     * @protected
     */
    protected showSelectedSuffix(option: Option) {
        return this.props.multiple && (this.controllableState.state.value as (string | number)[]).indexOf(
            option.value) !== -1;
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
                this.toggleOpen(false);
            }
            this.state.focus = false;
            this.timerClear();
        }
    }

    protected onScroll(event: MouseEvent, position?: Position) {
        this.props.onPopupScroll?.(event, position);
    }

    /**
     * 清空选项的回调
     * @param event
     * @protected
     */
    protected handleClear(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.controllableState.setState({
            value: this.props.multiple ? [] : undefined
        });
        this.props.onClear?.();
    }

    /**
     * 选中下拉选项的回调
     * @param option
     * @protected
     */
    protected handleChoice(option: Option) {
        if (this.props.multiple) {
            const { value } = option;
            const stateValue = [...this.controllableState.state.value as any[]];
            const index = stateValue.indexOf(value);
            if (index === -1) {
                // 新选中
                stateValue.push(value);
                this.controllableState.setState({
                    value: stateValue
                });
                this.props.onSelect?.(option);
            } else {
                // 取消选中
                this.handleDeleteChoice(option)
            }

        }else {
            this.controllableState.setState({
                value: option.value
            });
            this.props.onSelect?.(option);
        }

        if (!this.props.multiple) {
            this.timerClear();
            this.onDropdownVisibleChange(false);
        } else if (this.props.autoClearSearchValue) {
            this.clear();
        }
    }

    /**
     * 取消选中值的回调
     * @param option
     * @protected
     */
    protected handleDeleteChoice(option: Option) {
        const filterValues = (this.controllableState.state.value as any[]).filter((v) => v !== option.value);
        this.controllableState.setState({
            value: filterValues
        });
        this.props.onDeselect?.(option);
    }

    /**
     * 根据value值获取对应的option
     * @param value
     * @protected
     */
    protected getOption(value: string | number) {
        return this.props.options.find((c) => c.value === value);
    }

    public setup(): void {
        const target = { el: window };
        useImperativeHandle(() => ({
            focus: () => {
                this.state.focus = true;
                this.props.onFocus?.();
            },
            blur: () => {
                this.state.focus = false;
            }
        }), () => [])

        useEventListener(target, 'mousedown', this.onClickOutsideHandler);

        // 监听尺寸变化，如果是打开状态并且尺寸发生了变化，则进行对齐，使用ResizeObserver节约性能开销
        useResizeObserver(this.containerRef, (entry) => {
            if (this.controllableState.state.open) {
                this.triggerRef.current?.align();
            }
        });

        useEffect(() => {
            this.colsState.state.columns = this.props.options;
        }, () => [this.props.options]);

        // 是否默认展开逻辑
        useEffect(() => {
            if (this.props.defaultOpen && !this.props.disabled) {
                this.state.triggerNode = this.containerRef.el!;
                this.onDropdownVisibleChange(true);
            }
            // 初始有焦点时触发一次onFocus事件
            if (this.props.autoFocus) {
                this.props.onFocus?.();
            }
        }, () => []);

        // 在输入框宽度不足时进行适配换行处理
        useEffect(() => {
            if (!this.searchSpanRef.el) {
                return;
            }

            let width = '4px';
            if (this.state.searchValue) {
                width = getComputedStyle(this.searchTempRef.el!).width;
            }
            this.searchSpanRef.el.style.width = width;
        }, () => [this.state.searchValue, this.searchSpanRef.el]);
    }
}

export default Select;
