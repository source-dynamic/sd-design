import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import { BaseProps, baseProps } from '@/common/baseProps';
import classNames from 'classnames';
import { getPrefixCls, getSDSVG } from '@/components/_util/utils';
import './style/overflow.scss';
import { useSize } from '@/hooks/useSize';
import _closeSVG from '@/assets/close.svg';
import { isNumber } from '@/components/_util';

const closeSVG = getSDSVG(_closeSVG, {
    width: '1em',
    height: '1em'
});

type Props = {
    className?: string;
    values: (string | number)[];
    options: Option[];
    maxTagCount?: number | 'responsive';
    handleDelete?: (option: Option) => void;
} & BaseProps;

const overflowClass = getPrefixCls('overflow');
const displayTagClass = `${overflowClass}-display-span-tag`;

export type Option = {
    value: string | number;
    label: string
}

type State = {
    displayMaxIndex: number;
    displayOptions: Option[];  // 用于显示的option，不会包含overflow部分
    rest?: number;
};

class Overflow extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        values: { type: Array },
        options: { type: Array },
        maxTagCount: { type: [Number, String], optional: true },
        handleDelete: { type: Function, optional: true },
        ...baseProps
    };

    static tagTemplate = (inner: string) => `
<span t-att-class="classes.rest">
    <span class="${displayTagClass}-container">
        <span class="${displayTagClass}-label">
            ${inner}
        </span>
    </span>
</span>
`;

    static displayTemplate = (hasEvent: boolean) => `
<t t-slot="tag" data="option">
    <span class="${displayTagClass}">
        <span class="${displayTagClass}-container">
            <span class="${displayTagClass}-label">
                <t t-esc="option.label"/>
            </span>
            <span class="${displayTagClass}-icon" ${hasEvent ?
        't-on-click.stop="(event) => this.handleDelete(option)"' : ''} >${closeSVG}</span>
        </span>
    </span>
</t>
`;

    static template = xml`
<t>
    <t t-set="classes" t-value="getClass()"/>
    <span t-ref="container" t-att-class="classes.container">
        <t t-foreach="state.displayOptions" t-as="option" t-key="option.value">
            ${Overflow.displayTemplate(true)}
        </t> 
        <t t-if="state.rest" >
            ${Overflow.tagTemplate(`<t t-esc="'+' + state.rest + '...'"/>`)}
        </t>
        <span t-att-class="classes.suffix" t-ref="suffix">
            <t t-slot="suffix"/>
        </span>
        
        <t t-if="props.maxTagCount !== undefined">
            <span t-ref="temp" t-att-class="classes.temp">
                <t t-foreach="getWholeOptions()" t-as="option" t-key="option.value">
                    ${Overflow.displayTemplate(false)}
                </t> 
            </span>
            <span t-ref="overFlowTemp" t-att-class="classes.temp">
                <t t-foreach="props.values" t-as="value" t-key="value_index">
                    ${Overflow.tagTemplate(`<t t-esc="'+' + (value_index + 1) + '...'"/>`)}
                </t> 
            </span>
        </t>
    </span>
</t>
`;

    containerRef = useRef('container');

    tempRef = useRef('temp');

    overFlowTempRef = useRef('overFlowTemp');

    containerSize = useSize('container');

    suffixSize = useSize('suffix');

    state = useState<State>({
        displayMaxIndex: 0,  // 超出显示时用于显示的索引
        displayOptions: [],  // 超出显示时用于显示的值
        rest: undefined
    });

    protected getClass() {
        return {
            container: classNames(this.props.className, overflowClass, {
                [`${overflowClass}-responsive`]: this.props.maxTagCount === 'responsive'
            }),
            temp: classNames(this.props.className, `${overflowClass}-temp`),
            rest: classNames(displayTagClass, `${overflowClass}-rest`),
            suffix: `${overflowClass}-suffix`
        };
    }

    protected isOverflow(index: number, targetWidth: number, searchWidth: number): boolean {
        const restIndex = Math.max(0, this.props.values.length - 1 - index);
        const overFlowSpamWidth = this.overFlowTempRef.el?.children[restIndex].getBoundingClientRect().width || 0;
        return targetWidth + overFlowSpamWidth + searchWidth >= this.containerSize.width!;
    }

    protected handleDelete(option: Option) {
        this.props.handleDelete?.(option);
    }

    /**
     * 所有应该显示的option，包含overflow部分
     * @protected
     */
    protected getWholeOptions() {
        const { values, options } = this.props;
        return options.filter((c) => values.indexOf(c.value) !== -1);
    }

    public setup(): void {
        useEffect(() => {
            const { maxTagCount, values, options } = this.props;
            if (isNumber(maxTagCount)) {
                this.state.displayMaxIndex = maxTagCount;
            } else if (maxTagCount === undefined) {
                this.state.displayMaxIndex = Math.max(0, this.props.values.length);
            } else if (this.tempRef.el && this.containerSize.width) {
                // 获取所有子元素
                const children = this.tempRef.el.children;
                // 初始化总宽度
                let totalWidth = 0;
                this.state.displayMaxIndex = values.length;
                for (let i = 0; i < values.length; i++) {
                    // 获取子元素的宽度，不包括间隔和margin
                    const childWidth = children[i].getBoundingClientRect().width;
                    totalWidth += childWidth;
                    let searchWidth = this.suffixSize.width || 0;
                    // 如果超出或等于maxTagCount，跳出循环
                    if (this.isOverflow(i, totalWidth, searchWidth)) {
                        this.state.displayMaxIndex = i;
                        break;
                    }
                }
            }

            const displayValues = values.slice(0, this.state.displayMaxIndex);
            this.state.displayOptions = options.filter((c) => displayValues.indexOf(c.value) !== -1);
            // 计算剩余显示部分
            const restIndex = Math.max(0, this.props.values.length - this.state.displayMaxIndex);
            this.state.rest = restIndex > 0 ? restIndex : undefined;
        }, () => [
            this.tempRef.el, this.containerSize.width, this.suffixSize.width, this.props.values, this.props.options
        ]);
    }
}

export default Overflow;
