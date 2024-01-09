import { Component, useState, xml } from '@odoo/owl';
import { Switch } from '../../../src';

export default class SwitchRoot extends Component {
    static components = { Switch };

    state = useState<any>({
        disabled: undefined,
        size: undefined,
        loading: undefined
    });

    customState = useState({
        value: false
    })

    protected onchange(value: boolean) {
        this.customState.value = value;
    }

    static template = xml`
<div class="switch-container">
    <div class="switch-item">
        <Switch loading="state.loading" size="state.size" disabled="state.disabled" value="customState.value" onChange.bind="onchange"/>
    </div>
    
    <div class="switch-item">
        <Switch>
            <t t-set-slot="checked">
                开启
            </t>
            <t t-set-slot="unchecked">
                关闭
            </t>
        </Switch>
    </div>
</div>   
    `;
}
