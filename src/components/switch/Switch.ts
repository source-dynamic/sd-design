import { Component, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls, getSDSVG } from '@/components/_util/utils';
import _loadingSVG from '@/assets/loading-line.svg';
import classNames from 'classnames';
import './style/switch.scss';
import useControllableState from '@/hooks/useControllableState';

type Props = {
    className?: string;
    value?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'default'
    onChange?: (value: boolean) => void;
} & BaseProps;

const switchClass = getPrefixCls('switch');
const switchInnerClass = `${switchClass}-inner`;
const switchLoadingClass = `${switchClass}-loading`;

const loadingSVG = getSDSVG(_loadingSVG, {
    width: '100%',
    height: '100%'
}, switchLoadingClass);

export default class Switch extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        value: { type: Boolean, optional: true },
        defaultValue: { type: Boolean, optional: true },
        disabled: { type: Boolean, optional: true },
        loading: { type: Boolean, optional: true },
        size: { type: String, optional: true },
        onChange: { type: Function, optional: true },
        ...baseProps
    };

    static template = xml`
<t t-set="classes" t-value="getClasses()"></t>
<span t-att-class="classes.switch" t-on-click="onClick">
    <span t-att-class="classes.handle">
        <t t-if="props.loading">${loadingSVG}</t>
    </span>
    <span t-att-class="classes.inner">
        <span class="${switchInnerClass}-checked">
            <t t-slot="checked"/>
        </span>
        <span class="${switchInnerClass}-unchecked">
            <t t-slot="unchecked"/>
        </span>
    </span>
</span>    
`;

    controllableState = useControllableState<{ value: boolean }>(this.props, {
        value: this.props.defaultValue ?? false
    });

    get disabled() {
        return this.props.disabled || this.props.loading;
    }

    protected getClasses() {
        return {
            'switch': classNames(switchClass, this.props.className, {
                [`${switchClass}-checked`]: this.controllableState.state.value,
                [`${switchClass}-disabled`]: this.disabled,
                [`${switchClass}-sm`]: this.props.size === 'small'
            }),
            handle: `${switchClass}-handle`,
            inner: switchInnerClass
        };
    }

    protected onClick() {
        if (this.disabled) {
            return;
        }
        this.handleToggle();
    }

    protected handleToggle(force?: boolean) {
        const toValue = force ?? !this.controllableState.state.value;
        this.controllableState.setState({
            value: toValue
        });
        this.props.onChange?.(toValue);
    }
}
