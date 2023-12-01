import { Component, useState, xml } from '@odoo/owl';
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
    max?: number;
    min?: number;
    disabled?: boolean;
    bordered?: boolean;
    slots?: Record<string, any>;
}

class InputNumber extends Component<Props, State> {
    static components = { Input };

    static inputTemplate = `
<div t-att-class="getClasses()">
    <Input ref="inputRef" onFocus.bind="onFocus" onBlur.bind="onBlur" 
        value="controllableState.state.value" onChange.bind="onchangeValue"
        disabled="props.disabled"
        size="props.size"
        bordered="false"
        slots="filterSlots('ix')"
    />
    <t t-if="!props.disabled">
        <t t-set="iconClass" t-value="renderIconClasses()"/>
        <div class="${numberHandlerWrapClass}" t-ref="handlerRef" t-on-click="onClickWrap">
            <span t-att-class="iconClass.increase" t-on-click="() => this.increaseOrDecrease(true)">
                ${eyeSVG}
            </span>
            <span t-att-class="iconClass.decrease" t-on-click="() => this.increaseOrDecrease(false)">
                ${eyeCloseSVG}
            </span>
        </div>
    </t>    
</div>
`

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

    static defaultProps = {
        step: 1,
        defaultValue: 0,
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER
    };

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
        const { onBlur } = this.props;
        this.state.focused = false;
        onBlur?.(event);
    }

    protected onClickWrap(event: MouseEvent): void {
        this.inputRef.current?.focus();
    }

    protected onchangeValue(value: string): void {
        const number = BigNumber(formatNumberCode(value));
        this.controllableState.setState({
            value: number.isNaN() ? '0' : number.toFixed()
        });
    }

    /**
     * 是否允许增加或减少
     * @param isIncrease 加true，减false
     * @protected
     */
    protected enableIncreaseOrDecrease(isIncrease: boolean): boolean {
        const { min, max } = this.props;
        if (isIncrease && max) {
            return BigNumber(this.controllableState.state.value).isLessThan(max);
        }
        if (!isIncrease && min) {
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
        this.controllableState.setState({
            value: newValue.toFixed()
        });
    }

    protected getClasses() {
        const { slots } = this.props;

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
}

export default InputNumber;
