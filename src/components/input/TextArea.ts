import Input, { InputProps } from './Input';
import { useEffect, useState, xml } from '@odoo/owl';
import './style/textarea.scss';
import classNames from 'classnames';
import { getPrefixCls, omit, stylesToString } from '@/components/_util/utils';
import { calculateAutoSizeHeight } from '@/components/input/_utils/calculateNodeHeight';

type State = {
    style?: string
}

type AutoSize = boolean | {
    minRows: number
    maxRows: number
}

export type TextAreaProps = Omit<InputProps & {
    rows?: number;
    autoSize?: AutoSize;
    onResize?: (size: { width: number, height: number }) => void;
}, 'slots'>

const textareaClass = getPrefixCls('input-textarea');

export default class TextArea extends Input<TextAreaProps> {
    static props = {
        ...Input.props,
        rows: { type: Number, optional: true },
        autoSize: { type: [Boolean, Object], optional: true },
        onResize: { type: Function, optional: true }
    };

    static template = xml`
<ClearableLabeledWrapper className="props.className" inputType="'text'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="controllableState.state.value"
    handleReset.alike="(e) => this.handleReset(e)" count="state.count"
>
    <textarea
            t-att-style="textState.style"
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
            t-on-change="onChange"
        />
</ClearableLabeledWrapper>
`;

    textState = useState<State>({
        style: undefined
    });

    protected getClasses(): string {
        return classNames(super.getClasses(), textareaClass, {
            [`${textareaClass}-autosize`]: this.props.autoSize
        });
    }

    protected getRestProps() {
        return omit(super.getRestProps(), ['autoSize', 'onResize']);
    }

    protected resizeRows() {
        if (!this.props.autoSize) {
            this.textState.style = undefined;
            return;
        }

        let maxRows = 2;
        let minRows = 2;
        const el = this.inputRef.el!;
        const style = window.getComputedStyle(el);
        const attrs = ['padding-top', 'padding-bottom'];
        const [paddingTop, paddingBottom] = attrs.map(item => style.getPropertyValue(item));
        const lineHeight = parseFloat(style.getPropertyValue('line-height'));
        const rowsHeight = calculateAutoSizeHeight(el as unknown as HTMLTextAreaElement) - parseFloat(
            paddingTop) - parseFloat(paddingBottom);
        const rows = Math.ceil(rowsHeight / lineHeight);

        if (this.props.autoSize === true) {
            maxRows = Math.max(rows, maxRows);  // 随自身内容高度变化
        } else if (typeof this.props.autoSize === 'object') {
            minRows = this.props.autoSize.minRows;
            maxRows = this.props.autoSize.maxRows;
        }
        const realRows = Math.min(Math.max(rows, minRows), maxRows);
        this.textState.style = stylesToString({
            'height': `${realRows * lineHeight + parseFloat(paddingTop) + parseFloat(paddingBottom)}px`
        });
    }

    protected changeValue(value: string) {
        super.changeValue(value);
        if (this.props.autoSize) {
            this.resizeRows();
        } else {
            this.textState.style = undefined;
        }
    }

    setup(): void {
        super.setup();
        useEffect(() => {
            if (this.inputRef.el) {
                const element = this.inputRef.el;
                const resizeObserver = new ResizeObserver((entries) => {
                    const contentBoxSize = entries?.[0].borderBoxSize?.[0];
                    if (contentBoxSize) {
                        this.props.onResize?.({ width: contentBoxSize.inlineSize, height: contentBoxSize.blockSize });
                    }
                });
                resizeObserver.observe(element);

                return () => {
                    resizeObserver.unobserve(element);
                };
            }
        }, () => [this.inputRef.el]);

        useEffect(() => {
            if (this.props.autoSize && this.inputRef.el) {
                this.resizeRows();
            }
        }, () => [this.props.autoSize, this.inputRef.el, this.props.size]);
    }
}
