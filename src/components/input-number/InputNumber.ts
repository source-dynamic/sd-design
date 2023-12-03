import { Component, useEffect, useState, xml } from '@odoo/owl';
import Input from '@/components/input/Input';
import _upSVG from '@/assets/up.svg';
import _downSVG from '@/assets/down.svg';
import { getPrefixCls, getSDSVG, omit } from '@/components/_util/utils';
import './style/input-number.scss';
import classNames from 'classnames';
import { CompRef } from '@/hooks/useImperativeHandle';
import useControllableState from '@/hooks/useControllableState';
import { formatNumberCode } from '@/components/_util/stringUtils';
import BigNumber from 'bignumber.js';

const inputNumberWrapClass = getPrefixCls('input-number-wrap');
const inputNumberClass = getPrefixCls('input-number');
const iconClass = getPrefixCls('input-number-icon');
const numberHandlerWrapClass = getPrefixCls('input-number-handler-wrap');

const eyeSVG = getSDSVG(_upSVG, {
    width: '1em',
    height: '1em'
});

const eyeCloseSVG = getSDSVG(_downSVG, {
    width: '1em',
    height: '1em'
});

type State = {
    focused: boolean;
}

type Props = {
    step?: number;
    defaultValue?: number;
    value?: number;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onChange?: (value: number) => void;
    max?: number;
    min?: number;
    disabled?: boolean;
    bordered?: boolean;
    autoFocus?: boolean;
    changeOnBlur?: boolean;
    controls?: boolean;
    slots?: Record<string, any>;
}

class InputNumber extends Component<Props, State> {
    static defaultProps = {
        autoFocus: false,
        changeOnBlur: true,
        controls: true,
        step: 1,
        defaultValue: 0,
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER
    };

    static components = { Input };

    static inputTemplate = `
<div t-att-class="getClasses()">
    <Input className="" ref="inputRef" onFocus.bind="onFocus" onBlur.bind="onBlur" 
        value="controllableState.state.value" onChange.bind="onchangeValue"
        disabled="props.disabled"
        size="props.size"
        bordered="false"
        slots="filterSlots('ix')"
    />
    <t t-if="!props.disabled">
        <t t-set="iconClass" t-value="renderIconClasses()"/>
        <span class="${numberHandlerWrapClass}" t-ref="handlerRef" t-on-click="onClickWrap">
            <span t-att-class="iconClass.increase" t-on-click="() => this.increaseOrDecrease(true)">
                ${eyeSVG}
            </span>
            <span t-att-class="iconClass.decrease" t-on-click="() => this.increaseOrDecrease(false)">
                ${eyeCloseSVG}
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
        focused: false
    });

    controllableState = useControllableState(this.props, {
        value: `${this.props.defaultValue}` || '0'
    });

    inputRef: CompRef = { current: undefined };

    /**
     * 判断是否有前置、后置部分
     */
    protected hasAddon(): boolean {
        const { slots } = this.props;
        return !!(slots?.addonBefore || slots?.addonAfter);
    }

    protected filterSlots(type: 'addon' | 'ix') {
        if (this.props.slots) {
            return omit(this.props.slots, type === 'addon' ? ['suffix', 'prefix'] : ['addonBefore', 'addonAfter']);
        }
    }

    protected onFocus(event: FocusEvent): void {
        const { onFocus } = this.props;
        this.state.focused = true;
        onFocus?.(event);
    }

    protected onBlur(event: FocusEvent): void {
        const { onBlur, changeOnBlur } = this.props;
        this.state.focused = false;
        onBlur?.(event);
        if (changeOnBlur) {
            this.onchangeValue(this.getValueNotOutOfRange(this.controllableState.state.value));
        }
    }

    protected onClickWrap(): void {
        this.inputRef.current?.focus();
    }

    protected onchangeValue(value: string): void {
        const number = BigNumber(formatNumberCode(value));
        const v = number.isNaN() ? '0' : number.toFixed();
        this.controllableState.setState({
            value: v
        });
        this.props.onChange?.(Number(v));
    }

    protected getValueNotOutOfRange(value: string): string {
        const { max, min } = this.props;
        const v = BigNumber(value)
        if (v.isNaN() || v.isGreaterThan(max!)) {
            return max!.toString();
        }
        if (v.isNaN() || v.isLessThan(min!)) {
            return min!.toString();
        }
        // todo: 统一小数位数
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
     * 增加或减少数字
     * @param isIncrease 加true，减false
     * @protected
     */
    protected increaseOrDecrease(isIncrease: boolean): void {
        if (!this.enableIncreaseOrDecrease(isIncrease)) {
            return;
        }

        const { step } = this.props;
        const { value } = this.controllableState.state;
        const bn = BigNumber(formatNumberCode(value));
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

    setup(): void {
        useEffect(() => {
            if (this.props.autoFocus) {
                this.inputRef.current?.focus();
            }
        }, () => [this.inputRef.current]);
    }
}

export default InputNumber;
