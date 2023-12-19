import { Component, useState, xml } from '@odoo/owl';
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

type Value<T> = T | T[];

type Props = {
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    maxHeight?: number;
    multiple?: boolean;
    value: Value<string> | Value<number>;
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

type State = {
    isOpen: boolean;
    triggerNode?: HTMLElement;
    focus: boolean;
    options: {
        label: string;
        value: string;
    }[];
};

class Select extends Component<Props> {
    static components = { List, Trigger };

    static props = {
        getPopupContainer: { type: Function, optional: true },
        maxHeight: { type: Number, optional: true },
        value: { type: [String, Array, Number], optional: true },
        multiple: { type: Boolean, optional: true },
        ...baseProps
    };

    static defaultProps = {
        maxHeight: 256
    };

    state = useState<State>({
        isOpen: false,
        focus: false,
        triggerNode: undefined,
        options: Array.from({ length: 50 }, (_, index) => ({
            label: `选项${index}`,
            value: `value${index}`
        }))
    });

    controllableState = useControllableState(this.props, {
        value: []
    }, (val) => `${val}`);

    triggerRef = useCompRef();

    static template = xml`
 <span t-att-class="getClass()" t-on-click="toggleOpen">
    <span class="${selectSelectorClass}">
        <t t-slot="option" data="controllableState.value">
            <t t-esc="controllableState.state.value"/>
        </t>
    </span>
    <Trigger ref="triggerRef" className="'${selectDropdownClass}'" isOpen="state.isOpen" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" getStyle.bind="getDropdownStyle">
        <List dataSource="state.options" itemClassName="'${selectDropdownItemWrapperClass}'">
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
        this.state.focus = true;
        this.state.isOpen = !this.state.isOpen;
        if (this.state.isOpen) {
            this.state.triggerNode = event.currentTarget as HTMLElement;
        }
    }

    /**
     * select组件的样式类
     * @protected
     */
    protected getClass() {
        return classNames(selectClass, {
            [`${selectClass}-focus`]: this.state.focus,
            [`${selectClass}-vir`]: false
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
        if (this.state.isOpen) {
            const target = event.target as HTMLElement;
            // 在点击非选择框区域和非选项区域时，关闭下拉框
            if (!this.state.triggerNode?.contains(target) && !this.triggerRef.current?.wrapperRef.el?.contains(
                target)) {
                this.state.isOpen = false;
                this.state.focus = false;
            }
        }
    }

    protected onChoice(data) {
        this.controllableState.state.value = data.label;
    }

    public setup(): void {
        const target = { el: window };
        useEventListener(target, 'click', this.onClickOutsideHandler);
    }
}

export default Select;
