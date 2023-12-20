import { Component, useComponent, useEffect, useState, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls, getSDSVG, stylesToString } from '@/components/_util/utils';
import _downSVG from '@/assets/down.svg';
import classNames from 'classnames';
import List from '@/components/list/List';
import Trigger from '@/components/trigger/trigger';
import './style/select.scss';
import { useEventListener } from '@/hooks/useEventListener';
import { useCompRef } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import { useColsSearch } from '@/hooks/useColsSearch';
import { SizeType } from '@/components/_util/type';

type Value<T> = T | T[];

type Props = {
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    maxHeight?: number;
    disabled?: boolean;
    multiple?: boolean;
    value?: Value<string> | Value<number>;
    defaultValue?: Value<string> | Value<number>;
    size: SizeType,
    bordered?: boolean;
    defaultOpen?: boolean;
    autoFocus?: boolean;
} & BaseProps;

const selectClass = getPrefixCls('select');
const selectIconClass = getPrefixCls('select-icon');
const selectSelectorClass = getPrefixCls('select-selector');
const selectDropdownClass = getPrefixCls('select-dropdown');
const selectDropdownItemWrapperClass = getPrefixCls('select-dropdown-item-wrapper');
// 需要额外包裹一层，因为item最外层有padding，点击事件到达不了，影响体验
const selectDropdownItemClass = getPrefixCls('select-dropdown-item');

const downSVG = getSDSVG(_downSVG, {
    width: '1em',
    height: '1em'
});

export type Option = {
    label: string;
    value: number | string;
};

type State = {
    isOpen: boolean;
    triggerNode?: HTMLElement;
    focus: boolean;
    displayValue: Value<string>,
    options: Option[];
};

class Select extends Component<Props> {
    static components = { List, Trigger };

    static props = {
        getPopupContainer: { type: Function, optional: true },
        maxHeight: { type: Number, optional: true },
        disabled: { type: Boolean, optional: true },
        value: { type: [String, Array, Number], optional: true },
        defaultValue: { type: [String, Array, Number], optional: true },
        multiple: { type: Boolean, optional: true },
        size: { type: String, optional: true },
        bordered: { type: Boolean, optional: true },
        defaultOpen: { type: Boolean, optional: true },
        autoFocus: { type: Boolean, optional: true },
        ...baseProps
    };

    static defaultProps = {
        maxHeight: 256,
        defaultValue: 'value1'
    };

    state = useState<State>({
        isOpen: false,
        focus: this.props.autoFocus || false,
        triggerNode: undefined,
        displayValue: '',
        options: Array.from({ length: 50 }, (_, index) => ({
            label: `选项${index}`,
            value: `value${index}`
        }))
    });

    controllableState = useControllableState<{ value?: Value<string> | Value<number> }>(this.props, {
        value: this.props.defaultValue
    }, (val) => `${val}`);

    colsState = useColsSearch(this.state.options);

    triggerRef = useCompRef();

    static template = xml`
 <span t-att-class="getClass()" t-on-click="toggleOpen">
    <span class="${selectSelectorClass}">
        <t t-slot="option" data="controllableState.value">
            <t t-esc="state.displayValue"/>
        </t>
    </span>
    <Trigger ref="triggerRef" className="'${selectDropdownClass}'" isOpen="state.isOpen" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" getStyle.bind="getDropdownStyle">
        <List dataSource="state.options" itemClassName.bind="getItemClass">
            <t t-set-slot="item" t-slot-scope="scope">
                <div class="${selectDropdownItemClass}" t-on-click.synthetic="() => this.onChoice(scope.data)">
                    <t t-esc="scope.data.label"/>
                </div>
            </t>
        </List>
    </Trigger>
    <span class="${selectIconClass}">${downSVG}</span>
 </span>   
    `;

    /**
     * 切换下拉框的显示状态
     * @param event
     * @protected
     */
    protected toggleOpen(event: MouseEvent) {
        if (!this.props.disabled) {
            this.state.focus = true;
            this.state.isOpen = !this.state.isOpen;
            if (this.state.isOpen) {
                this.state.triggerNode = event.currentTarget as HTMLElement;
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
            [`${selectClass}-isOpen`]: this.state.isOpen,
            [`${selectClass}-disabled`]: !!disabled,
            [`${selectClass}-sm`]: size === 'small',
            [`${selectClass}-lg`]: size === 'large',
            [`${selectClass}-vir`]: false
        });
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
        return stylesToString({
            width: `${clientWidth}px`,
            'max-height': `${this.props.maxHeight}px`
        });
    }

    /**
     * 点击外部区域时，关闭下拉框
     * @param event
     * @protected
     */
    protected onClickOutsideHandler(event: MouseEvent) {
        const target = event.target as HTMLElement;
        // 在点击非选择框区域和非选项区域时，关闭下拉框
        if (!this.state.triggerNode?.contains(target) && !this.triggerRef.current?.wrapperRef.el?.contains(target)) {
            if (this.state.isOpen) {
                this.state.isOpen = false;
            }
            this.state.focus = false;
        }
    }

    protected onChoice(data: Option) {
        this.controllableState.state.value = data.value;
        this.state.isOpen = false;
    }

    public setup(): void {
        const component = useComponent();
        const target = { el: window };
        useEventListener(target, 'mousedown', this.onClickOutsideHandler);

        useEffect(() => {
            this.state.displayValue = this.colsState.displayCols.find(
                (c) => c.value === this.controllableState.state.value)?.label || '';
        }, () => [this.controllableState.state.value, this.colsState.displayCols]);

        useEffect(() => {
            if (this.props.defaultOpen && !this.props.disabled) {
                this.state.triggerNode = component.__owl__.bdom?.el as HTMLElement;
                this.state.isOpen = true;
            }
        }, () => [])

        useEffect(() => {
            console.log(this.colsState.displayCols);
        }, () => [this.colsState.displayCols]);
    }
}

export default Select;
