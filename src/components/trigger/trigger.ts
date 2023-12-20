import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import { getPrefixCls, stylesToString } from '@/components/_util/utils';
import { baseProps, BaseProps } from '@/common/baseProps';
import classNames from 'classnames';
import domAlign from 'dom-align';
import './style/trigger.scss';
import { useImperativeHandle } from '@/hooks/useImperativeHandle';
import { useEventListener } from '@/hooks/useEventListener';

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
const triggerHiddenClass = getPrefixCls('trigger-hidden');

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
        <t t-if="state.isShow">
            ${Trigger.contentTemplate}
        </t>
    </t>
</t>
    `;

    wrapperRef = useRef('wrapperRef');

    state = useState({
        isShow: false // 用于控制隐藏时销毁
    });

    protected getClass() {
        const { className, isOpen, triggerNode } = this.props;
        return classNames(triggerClass, className, `${triggerClass}-${isOpen ? 'fadein' : 'fadeout'}`);
    }

    protected getPopupContainer(): string {
        return this.props.getPopupContainer?.(this.props.triggerNode) || 'body';
    }

    protected getStyle() {
        // 初始状态强制设置为隐藏
        if (!this.props.triggerNode) {
            return stylesToString({
                'display': 'none'
            });
        }

        return this.props.getStyle?.(this.props.triggerNode) || undefined;
    }

    public setup(): void {
        useImperativeHandle({
            wrapperRef: this.wrapperRef
        });

        useEventListener(this.wrapperRef, 'animationend', (event) => {
            // 动画完成后添加hiddenclass，使不占据dom空间
            if (event.animationName === 'fadeout') {
                this.wrapperRef.el?.classList.add(triggerHiddenClass);
                // 如果设置了隐藏时销毁，在动画完成后移除dom
                if (this.props.destroyOnHide) {
                    this.state.isShow = false;
                }
            }
        });

        useEffect(() => {
            const { isOpen } = this.props;
            if (isOpen) {
                this.state.isShow = true;
            }
        }, () => [this.props.isOpen]);

        useEffect(() => {
            const { isOpen, triggerNode } = this.props;
            if (this.wrapperRef.el && isOpen && triggerNode) {
                // 打开时先移除hidden的class，否则display: none不能触发动画
                this.wrapperRef.el?.classList.remove(triggerHiddenClass);
                const alignConfig = {
                    points: ['tl', 'bl'],  // 用第二个参数的位置去对齐第一个参数的位置
                    offset: [0, 4], // 第一个参数是sourceNode的x轴偏移量，第二个参数是sourceNode的y轴偏移量
                    targetOffset: ['0', '0'], // 同offset，不过是针对targetNode的
                    overflow: { adjustX: true, adjustY: true } // if adjustX field is true, then will adjust source node in x direction if source node is invisible. if adjustY field is true, then will adjust source node in y direction if source node is invisible. if alwaysByViewport is true, the it will adjust if node is not inside viewport
                };
                domAlign(this.wrapperRef.el, triggerNode, alignConfig);
            }
        }, () => [this.wrapperRef.el, this.props.isOpen]);
    }
}

export default Trigger;
