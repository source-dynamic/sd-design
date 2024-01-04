import { Component, useState, xml } from '@odoo/owl';
import { Checkbox } from '../../../src';

export default class CheckboxRoot extends Component {
    static components = { Checkbox, CheckboxGroup: Checkbox.Group };

    state = useState<any>({
        disabled: undefined,
        indeterminate: undefined
    });

    customState = useState({
        value: false
    })

    protected onchange(value: boolean) {
        this.customState.value = value;
    }

    static template = xml`
<div class="checkbox-container">
    <div>
        <Checkbox value="customState.value" onChange.bind="onchange" indeterminate="state.indeterminate" disabled="state.disabled">
            a
        </Checkbox>
    </div>
</div>   
    `;
}
