import { Component, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls } from '@/components/_util/utils';
import './style/checkbox.scss';
import classNames from 'classnames';
import useControllableState from '@/hooks/useControllableState';

type Props = {
    className?: string;
    disabled?: boolean;
    defaultValue?: boolean;
    value?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
    name?: string;
} & BaseProps;

const checkboxClass = getPrefixCls('checkbox');
const checkboxWrapperClass = `${checkboxClass}-wrapper`;
const checkboxInputClass = `${checkboxClass}-input`;
const checkboxInnerClass = `${checkboxClass}-inner`;

export default class Checkbox extends Component<Props> {
    static props = {
        className: { type: String, optional: true },
        disabled: { type: Boolean, optional: true },
        defaultValue: { type: Boolean, optional: true },
        value: { type: Boolean, optional: true },
        indeterminate: { type: Boolean, optional: true },
        onChange: { type: Function, optional: true },
        name: { type: String, optional: true },
        ...baseProps
    };

    controllableState = useControllableState(this.props, {
        value: this.props.defaultValue ?? false
    });

    static template = xml`
<t t-set="classes" t-value="getClasses()"></t>
<label t-att-class="classes.wrapper">
    <span class="${checkboxClass}" t-on-click="onClick">
        <t t-if="controllableState.state.value">
            <input type="checkbox" t-att-class="classes.input" checked="checked" t-att-disabled="props.disabled"/>
        </t>
        <t t-else="">
            <input type="checkbox" t-att-class="classes.input" t-att-disabled="props.disabled"/>
        </t>
        <span t-att-class="classes.inner"/>
    </span>
    
    <span>
        <t t-slot="default"/>
    </span>
</label>    
`;

    protected getClasses() {
        return {
            wrapper: classNames(this.props.className, checkboxWrapperClass, {
                [`${checkboxWrapperClass}-disabled`]: this.props.disabled,
                [`${checkboxWrapperClass}-checked`]: this.controllableState.state.value,
                [`${checkboxWrapperClass}-indeterminate`]: this.props.indeterminate
            }),
            input: checkboxInputClass,
            inner: classNames(checkboxInnerClass, {
                [`${checkboxInnerClass}-checked`]: this.controllableState.state.value,
                [`${checkboxInnerClass}-indeterminate`]: this.props.indeterminate
            })
        };
    }

    protected onClick() {
        const { disabled, indeterminate } = this.props;
        if (disabled || indeterminate) {
            return;
        }
        this.toggleChecked();
    }

    protected toggleChecked(force?: boolean) {
        const toCheck = force ?? !this.controllableState.state.value;
        this.controllableState.setState({
            value: toCheck
        });
        this.env.checkboxGroup?.onChange(toCheck, this.props.name);
        this.props.onChange?.(toCheck);
    }
}
