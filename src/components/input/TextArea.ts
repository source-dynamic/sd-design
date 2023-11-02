import Input, { InputProps } from './Input';
import { xml } from '@odoo/owl';
import './style/textarea.scss';
import classNames from 'classnames';
import { getPrefixCls, omit } from '@/components/_util/utils';

export type TextAreaProps = Omit<InputProps & {
    autoSize?: boolean;
    onResize?: () => void;
}, 'slots'>

const textareaClass = getPrefixCls('input-textarea');

export default class TextArea extends Input<TextAreaProps> {
    static template = xml`
<ClearableLabeledWrapper inputType="'text'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="controllableState.state.value"
    handleReset.alike="(e) => this.handleReset(e)" count="state.count"
>
    <textarea
            t-att="state.restProps"
            t-att-disabled="props.disabled"
            t-att-maxlength="props.maxLength"
            t-att-type="props.type"
            t-att-placeholder="props.placeholder"
            t-att-class="getClasses()"
            t-on-focus.stop="onFocus"
            t-on-blur.stop="onBlur"
            t-ref="input"
            t-on-keydown.stop="handleKeyDown"
            t-on-compositionstart="onCompositionstart"
            t-on-compositionend="onCompositionend"
            t-on-input="onInput"
        />
</ClearableLabeledWrapper>
`;
    protected onResize(e: any): void {
        // todo 没生效
        console.log(e);
    }

    protected getClasses(): string {
        return classNames(super.getClasses(), textareaClass, {
            [`${textareaClass}-autosize`]: this.props.autoSize
        });
    }

    protected getRestProps() {
        return omit(super.getRestProps(), ['autoSize', 'onResize']);
    }
}
