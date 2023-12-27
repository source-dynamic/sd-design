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
import Trigger, { Placement } from '@/components/trigger/trigger';
import './style/select.scss';
import { useEventListener } from '@/hooks/useEventListener';
import { useCompRef } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import { useColsSearch } from '@/hooks/useColsSearch';
import { SizeType } from '@/components/_util/type';
import { useCancellableTimer } from '@/hooks/useCancellableTimer';
import { useResizeObserver } from '@/hooks/useSizeObserver';
import Overflow from '@/components/select/Overflow';

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

type Value<T> = T | T[];

type Props = {
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    placement?: Placement;
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

export type Option = {
    label: string;
    value: number | string;
};

type State = {
    searchValue: string;
    triggerNode?: HTMLElement;
    focus: boolean;
    multipleInputStyle?: string
};

class Select extends Component<Props> {
    static components = { List, Trigger, Overflow };

    static props = {
        getPopupContainer: { type: Function, optional: true },
        placement: { type: String, optional: true },
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
        maxTagCount: { type: [Number, String], optional: true },
        ...baseProps
    };

    static defaultProps = {
        listHeight: 256,
        popupMatchSelectWidth: true,
        multiple: true,
        placement: 'bottomLeft',
        defaultValue: Array.from({ length: 7 }, (_, index) => `value${index}`) // todo: 删除
    };

    state = useState<State>({
        searchValue: '',
        focus: this.props.autoFocus || false,
        triggerNode: undefined,
        multipleInputStyle: undefined
    });

    controllableState = useControllableState<{ value?: Value<string> | Value<number>, open?: boolean }>(this.props, {
        value: this.props.defaultValue,
        open: false
    });

    colsState = useColsSearch(this.props.options);

    cancelableTimer = useCancellableTimer();

    containerRef = useRef('container');

    searchTempRef = useRef('searchTemp');

    searchSpanRef = useRef('searchSpan');

    searchRef = useRef('search');

    triggerRef = useCompRef();

    static template = xml`
<span t-ref="container" t-att-class="getClass()" t-on-click="onClickContainer">
    <span class="${selectSelectorClass}">
        <div class="${selectSelectorClass}-temp" t-ref="searchTemp"><t t-esc="state.searchValue"/></div>
        <t t-set="searchClass" t-value="getSearchClass()"/>
        <t t-if="props.multiple">
            <Overflow className="searchClass.display" values="controllableState.state.value" maxTagCount="props.maxTagCount" formatter.bind="display">
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
            <span t-att-class="searchClass.display">
                <t t-esc="display(controllableState.state.value)"/>
            </span>
        </t>
    </span>
    <Trigger ref="triggerRef" className="getPopupClass()" isOpen="controllableState.state.open" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" getStyle.bind="getDropdownStyle" placement="props.placement">
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
                    <div class="${selectDropdownItemClass}" t-on-click.synthetic="() => this.handleChoice(scope.data)">
                        <span><t t-esc="scope.data.label"/></span>
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
        // 打开时如果有searchRef，则进行聚焦，仅multiple有用
        this.searchRef.el?.focus();
        // 如果已经open并且允许search，则不进行关闭
        if (this.controllableState.state.open && this.props.showSearch) {
            return;
        }
        this.toggleOpen();
        this.state.focus = true;
    }

    /**
     * 切换下拉框的显示状态
     * @param force 切换状态
     * @protected
     */
    protected toggleOpen(force?: boolean) {
        if (!this.props.disabled) {
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
            [`${selectClass}-searchable`]: this.props.showSearch,
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
            [`${selectDropdownItemClass}-selected`]: (this.controllableState.state.value as (string | number)[]).indexOf(item.value) !== -1
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

    protected showSelectedSuffix(item: Option){
        return this.props.multiple && (this.controllableState.state.value as (string | number)[]).indexOf(item.value) !== -1
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

    protected handleChoice(data: Option) {
        let newValue: any = data.value;
        if (this.props.multiple) {
            const stateValue = this.controllableState.state.value as (string | number)[];
            const index = stateValue.indexOf(newValue);
            if (index === -1) {
                stateValue.push(newValue);
            } else {
                stateValue.splice(index, 1);
            }
            newValue = [...stateValue];
        }

        this.controllableState.setState({
            value: newValue
        });

        if (!this.props.multiple) {
            this.timerClear();
            this.controllableState.setState({
                open: false
            });
        }
    }

    protected handleDeleteChoice(value: string | number) {
        const filterValues = (this.controllableState.state.value as any[]).filter((v) => v !== value);
        this.controllableState.setState({
            value: filterValues
        });
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
        const target = { el: window };
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
                this.controllableState.setState({
                    open: true
                });
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
