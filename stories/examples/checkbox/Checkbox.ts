import { Component, useState, xml } from '@odoo/owl';
import { Checkbox } from '../../../src';
import './checkbox.scss';

export default class CheckboxRoot extends Component {
    static components = { Checkbox, CheckboxGroup: Checkbox.Group };

    state = useState<any>({
        disabled: undefined,
        indeterminate: undefined
    });

    customState = useState({
        options: [
            { label: '选项1', name: '选项1', disabled: true },
            { label: '选项2', name: '选项2' },
        ]
    })

    protected singleChange(value) {
        console.log('singleChange', value);
    }

    protected onchange(values) {
        console.log(values);
    }

    static template = xml`
<div class="checkbox-container">
    <div>
        <Checkbox onChange.bind="singleChange" indeterminate="state.indeterminate" disabled="state.disabled">
            a
        </Checkbox>
    </div>
    
    <div class="checkbox-group">
        <CheckboxGroup onChange.bind="onchange" options="customState.options"/>
    </div>
    
    <div class="checkbox-group">
        <CheckboxGroup onChange.bind="onchange">
            <div>其他布局</div>
            <Checkbox name="'选项3'">选项3</Checkbox>
            <div>其他布局</div>
            <Checkbox name="'选项4'" indeterminate="true">选项4</Checkbox>
        </CheckboxGroup>
    </div>
</div>   
    `;
}
