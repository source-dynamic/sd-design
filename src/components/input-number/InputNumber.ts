import { Component, useState, xml } from '@odoo/owl';
import Input from '@/components/input/Input';
import _upSVG from '@/assets/up.svg';
import _downSVG from '@/assets/down.svg';
import { getPrefixCls, getSDSVG } from '@/components/_util/utils';
import './style/input-number.scss';
import classNames from 'classnames';
import { CompRef } from '@/hooks/useImperativeHandle';

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

class InputNumber extends Component {
    static components = { Input };

    static template = xml`
<div 
    t-att-class="getClasses()" 
>
    <Input ref="inputRef" onFocus.bind="onFocus" onBlur.bind="onBlur"/>
    <div class="${numberHandlerWrapClass}" t-ref="handlerRef" t-on-click="onClickWrap">
        <span class="${iconClass}">
            ${eyeSVG}
        </span>
        <span class="${iconClass}">
            ${eyeCloseSVG}
        </span>
    </div>
</div>
    `;

    state = useState<State>({
        focused: false,
    });

    inputRef: CompRef = { current: undefined };

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

    protected getClasses() {
        return classNames(inputNumberClass, {
            [`${inputNumberClass}-focused`]: this.state.focused
        });
    }
}

export default InputNumber;
