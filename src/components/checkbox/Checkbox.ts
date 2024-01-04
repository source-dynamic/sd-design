import { Component, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import { getPrefixCls } from '@/components/_util/utils';
import './style/checkbox.scss';
import classNames from 'classnames';
import useControllableState from '@/hooks/useControllableState';
import Group from './Group';

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

    get checkboxGroup(): Group | undefined {
        return this.env.checkboxGroup;
    }

    get checkboxGroupValue(): string[] | undefined {
        return this.checkboxGroup?.controllableState.state.value;
    }

    get mergedValue() {
        // 如果有checkboxGroup，则从checkboxGroup中获取value
        if (this.checkboxGroupValue && this.props.name) {
            return this.checkboxGroupValue.indexOf(this.props.name) > -1;
        }
        return this.controllableState.state.value;
    }

    get disabled() {
        return this.env.checkboxGroup?.props.disabled ?? this.props.disabled;
    }

    controllableState = useControllableState(this.props, {
        value: this.props.defaultValue ?? false
    });

    static template = xml`
<t t-set="classes" t-value="getClasses()"></t>
<label t-att-class="classes.wrapper">
    <span class="${checkboxClass}" t-on-click="onClick">
        <t t-if="mergedValue">
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
                [`${checkboxWrapperClass}-disabled`]: this.disabled,
                [`${checkboxWrapperClass}-checked`]: this.mergedValue,
                [`${checkboxWrapperClass}-indeterminate`]: this.props.indeterminate
            }),
            input: checkboxInputClass,
            inner: classNames(checkboxInnerClass, {
                [`${checkboxInnerClass}-checked`]: this.mergedValue,
                [`${checkboxInnerClass}-indeterminate`]: this.props.indeterminate
            })
        };
    }

    protected onClick() {
        const { indeterminate } = this.props;
        if (this.disabled || indeterminate) {
            return;
        }
        this.toggleChecked();
    }

    /**
     * 在checkboxGroup中切换选中状态
     * @param force
     * @protected
     */
    protected toggleCheckedInGroup(force?: boolean) {
        const currentChecked = this.checkboxGroupValue!.indexOf(this.props.name!) !== -1;
        const toCheck = force ?? !currentChecked;
        this.env.checkboxGroup?.onChange(toCheck, this.props.name);
        this.props.onChange?.(toCheck);
    }

    /**
     * 在独立使用时切换选中状态
     * @param force
     * @protected
     */
    protected toggleCheckedWithoutGroup(force?: boolean) {
        const toCheck = force ?? !this.controllableState.state.value;
        this.controllableState.setState({
            value: toCheck
        });
        this.props.onChange?.(toCheck);
    }

    /**
     * 切换选中状态
     * @param force
     * @protected
     */
    protected toggleChecked(force?: boolean) {
        if (this.checkboxGroup && this.props.name) {
            this.toggleCheckedInGroup(force);
        } else {
            this.toggleCheckedWithoutGroup(force);
        }
    }
}
