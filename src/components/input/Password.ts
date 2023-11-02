import { useEffect, useState, xml } from '@odoo/owl';
import Input, { InputProps } from './Input';
import _eyeSVG from '@/assets/eye.svg';
import _eyeCloseSVG from '@/assets/eye-close.svg';
import { getPrefixCls, getSDSVG, omit } from '@/components/_util/utils';
import classNames from 'classnames';
import './style/password.scss';
import useControllableState from '@/hooks/useControllableState';

const eyeSVG = getSDSVG(_eyeSVG, {
    width: '1em',
    height: '1em'
});

const eyeCloseSVG = getSDSVG(_eyeCloseSVG, {
    width: '1em',
    height: '1em'
});

export type PasswordProps = InputProps & {
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
}

type State = {
    focused: boolean;
    value: any;
    type: string;
    restProps: {}
}

const passwordClass = getPrefixCls('input-password');

export default class Password extends Input<PasswordProps> {
    static template = xml`
 <ClearableLabeledWrapper inputType="'input'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="state.value"
    handleReset.alike="(e) => this.handleReset(e)" slots="props.slots">
    <t t-set-slot="suffix">
        <div t-on-click="togglePasswordVisibility" class="${passwordClass}-suffix">
            <t t-if="controllableState.state.visible">
                ${eyeCloseSVG}
            </t>
            <t t-else="">
                ${eyeSVG}
            </t>
        </div>
    </t>
    
    <input 
        t-att="state.restProps"
        t-att-disabled="props.disabled"
        t-att-maxlength="props.maxLength"
        t-att-type="state.type"
        t-att-placeholder="props.placeholder"
        t-att-class="getClasses()"
        t-on-focus.stop="onFocus"
        t-on-blur.stop="onBlur"
        t-ref="input"
        t-on-keydown.stop="handleKeyDown"
        t-model="state.value"
    />
 </ClearableLabeledWrapper>   
    `;

    state = useState<State>({
        focused: false,
        value: '',
        type: 'password',
        restProps: {}
    });

    controllableState = useControllableState(this.props, {
        visible: false,
        value: this.props.defaultValue || ''
    });

    protected getClasses(): string {
        return classNames(super.getClasses(), passwordClass);
    }

    protected togglePasswordVisibility(): void {
        if (!this.props.disabled) {
            this.controllableState.setState({
                visible: !this.controllableState.state.visible
            });
            this.props.onVisibleChange?.(!this.controllableState.state.visible);
        }
    }

    protected getRestProps() {
        return omit(super.getRestProps(), ['visible', 'onVisibleChange']);
    }

    public setup(): void {
        super.setup();
        useEffect(() => {
            this.state.type = this.controllableState.state.visible ? 'text' : 'password';
        }, () => [this.controllableState.state.visible]);
    }
}
