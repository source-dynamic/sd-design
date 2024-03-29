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
    onScroll?: (event: MouseEvent) => void;
} & BaseProps;

const triggerClass = getPrefixCls('trigger');
const triggerHiddenClass = getPrefixCls('trigger-hidden');

// 用第二个参数的位置去对齐第一个参数的位置
const placementMap: Record<Placement, [string, string]> = {
    topLeft: ['bl', 'tl'],
    topRight: ['br', 'tr'],
    bottomLeft: ['tl', 'bl'],
    bottomRight: ['tr', 'br']
};

// 第一个参数是sourceNode的x轴偏移量，第二个参数是sourceNode的y轴偏移量
const placementOffsetMap: Record<Placement, [number, number]> = {
    topLeft: [0, -4],
    topRight: [0, -4],
    bottomLeft: [0, 4],
    bottomRight: [0, 4]
};

class Trigger extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        placement: { type: String },
        isOpen: { type: Boolean },
        destroyOnHide: { type: Boolean, optional: true },
        triggerNode: { type: Object, optional: true },
        getPopupContainer: { type: Function, optional: true },
        getStyle: { type: Function, optional: true },
        onScroll: { type: Function, optional: true },
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

    lastIsOpen = false;  // 最后一次是打开还是关闭，用来控制是否需要展示fade动画，因为第一次打开始终需要展示动画

    protected getClass() {
        const { className, isOpen } = this.props;
        const notShowFade = isOpen && this.lastIsOpen;
        return classNames(triggerClass, className, {
            [`${triggerClass}-${isOpen ? 'fadein' : 'fadeout'}`]: !notShowFade
        });
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

    /**
     * 对齐
     * @protected
     */
    protected align() {
        const { triggerNode, placement } = this.props;
        if (this.wrapperRef.el && triggerNode) {
            const alignConfig = {
                points: placementMap[placement],
                offset: placementOffsetMap[placement],
                targetOffset: ['0', '0'] // 同offset，不过是针对targetNode的
            };
            domAlign(this.wrapperRef.el, triggerNode, alignConfig);
        }
    }

    public setup(): void {
        useImperativeHandle(() => ({
            wrapperRef: this.wrapperRef,
            align: this.align.bind(this)
        }), () => []);

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

        useEventListener(this.wrapperRef, 'scroll', (event) => {
            this.props.onScroll?.(event);
        });

        useEffect(() => {
            const { isOpen } = this.props;
            if (isOpen) {
                this.state.isShow = true;
            }
        }, () => [this.props.isOpen]);

        useEffect(() => {
            const { isOpen } = this.props;
            this.lastIsOpen = isOpen;
            if (isOpen) {
                // 打开时先移除hidden的class，否则display: none不能触发动画
                this.wrapperRef.el?.classList.remove(triggerHiddenClass);
            }
            this.align();
        }, () => [this.wrapperRef.el, this.props.isOpen, this.props.triggerNode]);
    }
}

export default Trigger;
