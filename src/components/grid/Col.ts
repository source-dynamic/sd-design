import { Component, xml } from '@odoo/owl';
import { responsiveArray } from '@/components/_util/responsiveObserve';
import { getPrefixCls, stylesToString } from '@/components/_util/utils';
import classNames from 'classnames';
import Row from './Row';

type ColSpanType = number | string;

type IColSize = {
    span?: ColSpanType;
    order?: ColSpanType;
    offset?: ColSpanType;
    push?: ColSpanType;
    pull?: ColSpanType;
};

type Props = {
    className?: string;
    span?: ColSpanType;
    order?: ColSpanType;
    offset?: ColSpanType;
    push?: ColSpanType;
    pull?: ColSpanType;
    xs?: ColSpanType | IColSize;
    sm?: ColSpanType | IColSize;
    md?: ColSpanType | IColSize;
    lg?: ColSpanType | IColSize;
    xl?: ColSpanType | IColSize;
    xxl?: ColSpanType | IColSize;
    flex?: number | 'none' | 'auto' | string;
}

type Env = {
    row: Row
}

const parseFlex = (flex: number | 'none' | 'auto' | string): string => {
    if (typeof flex === 'number') {
        return `${flex} ${flex} auto`;
    }
    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
    }
    return flex;
};

export default class Col extends Component<Props, Env> {
    static props = {
        className: { type: String, optional: true },
        span: { type: [Number, String], optional: true },
        order: { type: [Number, String], optional: true },
        offset: { type: [Number, String], optional: true },
        push: { type: [Number, String], optional: true },
        pull: { type: [Number, String], optional: true },
        xs: { type: [Number, Object], optional: true },
        sm: { type: [Number, Object], optional: true },
        md: { type: [Number, Object], optional: true },
        lg: { type: [Number, Object], optional: true },
        xl: { type: [Number, Object], optional: true },
        xxl: { type: [Number, Object], optional: true },
        flex: { type: [Number, String], optional: true },
        slots: { type: Object, optional: true }
    };

    static template = xml`
    <div t-att-class="getClasses()" t-att-style="getStyle()">
        <t t-slot="default"/>
    </div>
    `;

    protected getStyle(): string | undefined {
        let colStyle: { [key: string]: any } = {};
        if (this.props.flex) {
            colStyle.flex = parseFlex(this.props.flex);
        }
        return stylesToString(colStyle) || undefined;
    }

    protected getClasses(): string {
        const { span, order, offset, push, pull } = this.props;
        const prefixCls = getPrefixCls('col');
        let sizeClassObj = {};
        // 组装响应式class类
        responsiveArray.forEach((size) => {
            let sizeProps: IColSize = {};
            const propSize = this.props[size];
            if (typeof propSize === 'number') {
                sizeProps.span = propSize;
            } else if (typeof propSize === 'object') {
                sizeProps = propSize || {};
            }
            sizeClassObj = {
                ...sizeClassObj,
                [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
                [`${prefixCls}-${size}-order-${sizeProps.order}`]:
                sizeProps.order || sizeProps.order === 0,
                [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
                sizeProps.offset || sizeProps.offset === 0,
                [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
                [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0
            };
        });

        return classNames(
            prefixCls,
            this.props.className,
            {
                [`${prefixCls}-${span}`]: span !== undefined,
                [`${prefixCls}-order-${order}`]: order,
                [`${prefixCls}-offset-${offset}`]: offset,
                [`${prefixCls}-push-${push}`]: push,
                [`${prefixCls}-pull-${pull}`]: pull
            },
            sizeClassObj
        );
    }
}
