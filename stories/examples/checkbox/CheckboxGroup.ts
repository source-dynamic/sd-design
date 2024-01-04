import { Component, useState, xml } from '@odoo/owl';
import { Checkbox } from '../../../src';

export default class CheckboxGroupRoot extends Component {
    static components = { CheckboxGroup: Checkbox.Group, Checkbox };

    customState = useState<any>({
        options: [
            { label: '选项1', name: '选项1', disabled: true },
            { label: '选项2', name: '选项2' },
        ],
        value: ['选项3']
    })

    get checkedValue(): string {
        return this.customState.value.join(', ');
    }

    protected onchange(values: string[]) {
        this.customState.value = values;
    }

    static template = xml`
<div class="checkbox-container">
    <div class="checkbox-group">
        <CheckboxGroup options="customState.options"/>
    </div>
    
    <div class="checkbox-group">
        <CheckboxGroup value="customState.value" onChange.bind="onchange">
            <span>当前选中：<t t-esc="checkedValue"/></span>
            <div>-------</div>
            <Checkbox name="'选项3'">选项3</Checkbox>
            <div>-------</div>
            <Checkbox name="'选项4'">选项4</Checkbox>
        </CheckboxGroup>
    </div>
</div>  
`
}
