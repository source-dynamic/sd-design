import { Component, useChildSubEnv, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import Checkbox from './Checkbox';
import { isObject } from '@/components/_util';
import useControllableState from '@/hooks/useControllableState';

type Option = {
    label: string,
    name: string
    disabled?: boolean
}

type Props = {
    options?: (string | Option)[];
    onChange?: (checkedValues: (string)[]) => void;
    defaultValue?: string[];
    value?: string[];
} & BaseProps;

export default class Group extends Component<Props> {
    static props = {
        options: { type: Array, optional: true },
        onChange: { type: Function, optional: true },
        defaultValue: { type: Array, optional: true },
        value: { type: Array, optional: true },
        ...baseProps
    };

    static components = { Checkbox };

    static template = xml`
<t t-if="props.options">
    <t t-foreach="props.options" t-as="option" t-key="option_index">
        <t t-set="checkboxName" t-value="option.name || option"/>
        <Checkbox name="checkboxName" value="controllableState.state.value.indexOf(checkboxName) > -1" disabled="option.disabled">
            <t t-esc="showOption(option)"/>
        </Checkbox>
    </t>  
</t>  
<t t-else="">
    <t t-slot="default"/>
</t>
`;
    controllableState = useControllableState(this.props, {
        value: this.props.defaultValue ?? []
    });

    protected showOption(option: string | number | Option) {
        if (isObject(option)) {
            return option.label;
        } else if (!!option) {
            return option;
        }
    }

    protected onChange(checkedValue: boolean, name: string) {
        const value = [...this.controllableState.state.value];
        if (checkedValue) {
            value.push(name);
        } else {
            const index = value.indexOf(name);
            value.splice(index, 1);
        }
        this.controllableState.setState({ value });
        this.props.onChange?.(value);
    }

    public setup(): void {
        useChildSubEnv({ checkboxGroup: this });
    }
}
