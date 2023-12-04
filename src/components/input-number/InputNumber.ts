import { Component, useEffect, useState, xml } from '@odoo/owl';
import Input from '@/components/input/Input';
import _upSVG from '@/assets/up.svg';
import _downSVG from '@/assets/down.svg';
import { getPrefixCls, getSDSVG, omit } from '@/components/_util/utils';
import './style/input-number.scss';
import classNames from 'classnames';
import { CompRef } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import BigNumber from 'bignumber.js';

const inputNumberWrapClass = getPrefixCls('input-number-wrap');
const inputNumberClass = getPrefixCls('input-number');
const iconClass = getPrefixCls('input-number-icon');
const numberHandlerWrapClass = getPrefixCls('input-number-handler-wrap');

const upSVG = getSDSVG(_upSVG, {
    width: '1em',
    height: '1em'
});

const downSVG = getSDSVG(_downSVG, {
    width: '1em',
    height: '1em'
});

type Props = {
    step?: number;
    defaultValue?: number;
    value?: number;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onChange?: (value: number | string) => void;
    max?: number;
    min?: number;
    disabled?: boolean;
    bordered?: boolean;
    autoFocus?: boolean;
    changeOnBlur?: boolean;
    controls?: boolean;
    decimalSeparator?: string;
    precision?: number;
    formatter?: (value: string) => string;
    parser?: (value: string) => string;
    keyboard?: boolean;
    readonly?: boolean;
    stringMode?: boolean;
    onPressEnter?: (event: Event) => void;
    onStep?: (value: number, info: { offset: number; type: 'up' | 'down' }) => void;
    slots?: Record<string, any>;
}

type State = {
    focused: boolean;
    formatValue: string;
}

class InputNumber extends Component<Props, State> {
    static defaultProps = {
        autoFocus: false,
        changeOnBlur: true,
        controls: true,
        keyboard: true,
        step: 1,
        defaultValue: 0,
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER
    };

    static components = { Input };

    static inputTemplate = `
<div t-att-class="getClasses()">
    <Input className="" ref="inputRef" onFocus.bind="onFocus" onBlur.bind="onBlur" 
        onKeyDown.bind="onKeyDown"
        readonly="props.readonly"
        onPressEnter="props.onPressEnter"
        value="state.formatValue" onChange.bind="onchangeValue"
        disabled="props.disabled"
        size="props.size"
        bordered="false"
        slots="filterSlots('ix')"
    />
    <t t-if="showControls()">
        <t t-set="iconClass" t-value="renderIconClasses()"/>
        <span class="${numberHandlerWrapClass}" t-ref="handlerRef" t-on-click="onClickWrap">
            <span t-att-class="iconClass.increase" t-on-click="(event) => this.onStep('up', event)">
                <t t-slot="upIcon">
                    ${upSVG}
                </t>
            </span>
            <span t-att-class="iconClass.decrease" t-on-click="(event) => this.onStep('down', event)">
                <t t-slot="downIcon">
                    ${downSVG}
                </t>
            </span>
        </span>
    </t>    
</div>
`;

    static template = xml`
<t t-if="hasAddon()">
    <span class="${inputNumberWrapClass}">
        <t t-if="props.slots.addonBefore">
            <span class="${inputNumberWrapClass}-addon ${inputNumberClass}-addon-before">
                <t t-slot="addonBefore"/>
            </span>
        </t>
        ${InputNumber.inputTemplate}
        <t t-if="props.slots.addonAfter">
            <span class="${inputNumberWrapClass}-addon ${inputNumberClass}-prefix">
                <t t-slot="addonAfter"/>
            </span>
        </t>
    </span>
</t>
<t t-else="">
    ${InputNumber.inputTemplate}
</t>
    `;

    state = useState<State>({
        focused: false,
        formatValue: ''
    });

    controllableState = useControllableState(this.props, {
        value: this.precisionValue(BigNumber(`${this.props.defaultValue}` || '0'))
    });

    inputRef: CompRef = { current: undefined };

    /**
     * 判断是否有前置、后置部分
     */
    protected hasAddon(): boolean {
        const { slots } = this.props;
        return !!(slots?.addonBefore || slots?.addonAfter);
    }

    /**
     * 过滤掉slots
     * @param type 如果是addon，则过滤掉suffix、prefix，如果是ix，则过滤掉addonBefore、addonAfter
     * @protected
     */
    protected filterSlots(type: 'addon' | 'ix') {
        if (this.props.slots) {
            return omit(this.props.slots, type === 'addon' ? ['suffix', 'prefix'] : ['addonBefore', 'addonAfter']);
        }
    }

    /**
     * 是否显示加减按钮
     * @protected
     */
    protected showControls(): boolean {
        return !!this.props.controls && !this.props.disabled;
    }

    /**
     * 获取焦点回调
     * @param event
     * @protected
     */
    protected onFocus(event: FocusEvent): void {
        const { onFocus } = this.props;
        this.state.focused = true;
        onFocus?.(event);
    }

    /**
     * 失去焦点回调，如果changeOnBlur为true，则在失去焦点时触发onChange
     * @param event
     * @protected
     */
    protected onBlur(event: FocusEvent): void {
        const { onBlur, changeOnBlur } = this.props;
        this.state.focused = false;
        onBlur?.(event);
        if (changeOnBlur) {
            this.onchangeValue(this.getValueNotOutOfRange(this.controllableState.state.value));
        }
    }

    /**
     * 键盘按下回调，如果keyboard为true，则可以使用上下键控制数字增减
     * @param event
     * @protected
     */
    protected onKeyDown(event: KeyboardEvent): void {
        const { keyboard } = this.props;
        if (keyboard) {
            switch (event.key.toLowerCase()) {
                case 'arrowup':
                    event.preventDefault();
                    this.increaseOrDecrease(true, event);
                    break;
                case 'arrowdown':
                    event.preventDefault();
                    this.increaseOrDecrease(false, event);
                    break;
            }
        }
    }

    /**
     * 点击加减按钮回调
     * @param type up为加，down为减
     * @param event
     * @protected
     */
    protected onStep(type: 'up' | 'down', event: Event): void {
        const { onStep } = this.props;
        const oldValue = this.controllableState.state.value;
        this.increaseOrDecrease(type === 'up', event);
        onStep?.(Number(oldValue), { offset: this.props.step as number, type });
    }

    /**
     * 点击外层wrap回调，聚焦input
     * @protected
     */
    protected onClickWrap(): void {
        this.inputRef.current?.focus();
    }

    /**
     * 精确数字小数点并返回对应的字符串
     * @param bn 值的BigNumber实例
     * @protected
     */
    protected precisionValue(bn: BigNumber): string {
        const { precision } = this.props;
        return precision ? bn.toFixed(precision) : bn.toFixed();
    }

    /**
     * 输入框值改变回调
     * @param value
     * @protected
     */
    protected onchangeValue(value: string): void {
        const { stringMode } = this.props;
        let bn = BigNumber(this.parse(value));
        bn = bn.isNaN() ? BigNumber('0') : bn;
        let stringValue = this.precisionValue(bn);
        this.controllableState.setState({
            value: stringValue
        });
        this.props.onChange?.(stringMode ? stringValue : Number(stringValue));
    }

    /**
     * 获取不超出范围的值，根据value值和max、min值判断
     * @param value
     * @protected
     */
    protected getValueNotOutOfRange(value: string): string {
        const { max, min } = this.props;
        let bn = BigNumber(value);
        const v = bn.isNaN() ? BigNumber('0') : bn;
        if (v.isNaN() || v.isGreaterThan(max!)) {
            return max!.toString();
        }
        if (v.isNaN() || v.isLessThan(min!)) {
            return min!.toString();
        }
        return v.toFixed();
    }

    /**
     * 是否允许增加或减少
     * @param isIncrease 加true，减false
     * @protected
     */
    protected enableIncreaseOrDecrease(isIncrease: boolean): boolean {
        const { min, max } = this.props;
        if (isIncrease && max !== undefined) {
            return BigNumber(this.controllableState.state.value).isLessThan(max);
        }
        if (!isIncrease && min !== undefined) {
            return BigNumber(this.controllableState.state.value).isGreaterThan(min);
        }
        return true;
    }

    /**
     * 增加或减少value值
     * @param isIncrease 加true，减false
     * @param event
     * @protected
     */
    protected increaseOrDecrease(isIncrease: boolean, event: Event): void {
        event?.stopPropagation();
        event?.preventDefault();
        if (!this.enableIncreaseOrDecrease(isIncrease)) {
            return;
        }

        const { step } = this.props;
        const { value } = this.controllableState.state;
        const bn = BigNumber(value);
        const newValue = isIncrease ? bn.plus(step as number) : bn.minus(step as number);
        this.onchangeValue(this.getValueNotOutOfRange(newValue.toFixed()));
    }

    protected getClasses() {
        return classNames(inputNumberClass, {
            [`${inputNumberClass}-focused`]: this.state.focused,
            [`${inputNumberClass}-disabled`]: !!this.props.disabled,
            [`${inputNumberClass}-borderless`]: this.props.bordered === false
        });
    }

    protected renderIconClasses() {
        return {
            increase: classNames(iconClass, {
                [`${iconClass}-disabled`]: !this.enableIncreaseOrDecrease(true)
            }),
            decrease: classNames(iconClass, {
                [`${iconClass}-disabled`]: !this.enableIncreaseOrDecrease(false)
            })
        };
    }

    /**
     * 格式化value值，如果有formatter，则使用formatter格式化
     * @param value
     * @protected
     */
    protected formatValue(value: string): string {
        const { decimalSeparator, formatter } = this.props;
        if (decimalSeparator) {
            // 替换.为decimalSeparator
            value = value.replace(/\./g, decimalSeparator);
        }
        if (formatter) {
            value = formatter(value);
        }

        return value;
    }

    /**
     * 解析value值，如果有parser，则使用parser解析
     * @param value
     * @protected
     */
    protected parse(value: string): string {
        const { decimalSeparator, parser } = this.props;
        if (decimalSeparator) {
            // 替换decimalSeparator为. decimalSeparator可能为.或者其他
            value = value.replace(new RegExp(decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '.');
        }
        if (parser) {
            value = parser(value);
        }
        return value;
    }

    setup(): void {
        useEffect(() => {
            if (this.props.autoFocus) {
                this.inputRef.current?.focus();
            }
        }, () => [this.inputRef.current]);

        useEffect(() => {
            this.state.formatValue = this.formatValue(this.controllableState.state.value);
        }, () => [this.controllableState.state.value]);
    }
}

export default InputNumber;
