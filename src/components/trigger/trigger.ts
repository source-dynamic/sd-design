import { Component, useEffect, useRef, xml } from '@odoo/owl';
import { getPrefixCls } from '@/components/_util/utils';
import { baseProps, BaseProps } from '@/common/baseProps';
import classNames from 'classnames';
import domAlign from 'dom-align';
import './style/trigger.scss';
import { useImperativeHandle } from '@/hooks/useImperativeHandle';

export type Placement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

type Props = {
    placement: Placement
    className?: string;
    isOpen: boolean;  // 是否显示
    destroyOnHide?: boolean;  // 隐藏时销毁
    triggerNode?: HTMLElement;  // 触发节点
    getPopupContainer?: (triggerNode?: HTMLElement) => string; // 返回一个选择器字符串
    getStyle?: (triggerNode?: HTMLElement) => string; // 返回一个样式字符串
} & BaseProps;

const triggerClass = getPrefixCls('trigger');

class Trigger extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        placement: { type: String, optional: true },
        isOpen: { type: Boolean },
        destroyOnHide: { type: Boolean, optional: true },
        triggerNode: { type: Object, optional: true },
        getPopupContainer: { type: Function, optional: true },
        getStyle: { type: Function, optional: true },
        ...baseProps
    };

    static defaultProps = {
        destroyOnHide: true
    };

    static contentTemplate = `
<div t-ref="wrapperRef" t-att-class="getClass()" t-portal="getPopupContainer()" t-att-style="getStyle()">
    <t t-slot="default"/>
</div>  
    `;

    static template = xml`
<t>
    <t t-if="!props.destroyOnHide">
        ${Trigger.contentTemplate}
    </t>
    <t t-else="">
        <t t-if="props.isOpen">
            ${Trigger.contentTemplate}
        </t>
    </t>
</t>
    `;

    wrapperRef = useRef('wrapperRef');

    protected getClass() {
        const { className, isOpen } = this.props;
        return classNames(triggerClass, className, {
            [`${triggerClass}-hidden`]: !isOpen
        });
    }

    protected getPopupContainer(): string {
        return this.props.getPopupContainer?.(this.props.triggerNode) || 'body';
    }

    protected getStyle() {
        if (!this.props.isOpen) {
            return;
        }

        return this.props.getStyle?.(this.props.triggerNode) || undefined;
    }

    public setup(): void {
        useImperativeHandle({
            wrapperRef: this.wrapperRef
        })

        useEffect(() => {
            const { isOpen, triggerNode } = this.props;
            if (isOpen && triggerNode) {
                const alignConfig = {
                    points: ['tl', 'bl'],  // 用第二个参数的位置去对齐第一个参数的位置
                    offset: [0, 4], // 第一个参数是sourceNode的x轴偏移量，第二个参数是sourceNode的y轴偏移量
                    targetOffset: ['0', '0'], // 同offset，不过是针对targetNode的
                    overflow: { adjustX: true, adjustY: true } // if adjustX field is true, then will adjust source node in x direction if source node is invisible. if adjustY field is true, then will adjust source node in y direction if source node is invisible. if alwaysByViewport is true, the it will adjust if node is not inside viewport
                };
                domAlign(this.wrapperRef.el, triggerNode, alignConfig);
            }
        }, () => [this.props.isOpen, this.wrapperRef.el]);
    }
}

export default Trigger;
