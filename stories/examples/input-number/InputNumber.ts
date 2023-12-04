import { Component, useState, xml } from '@odoo/owl';
import { InputNumber } from '../../../src';

export default class InputRoot extends Component {
    static components = { InputNumber };

    state = useState({
        disabled: false,
        size: 'middle',
        step: 1,
        border: true,
        controls: true,
        decimalSeparator: '.',
        keyboard: true,
        readonly: false
    });

    static template = xml`
<div class="input-container">
    <InputNumber max="4" min="-20" placeholder="'InputNumber'" 
        disabled="state.disabled" 
        size="state.size" 
        step="state.step"
        controls="state.controls" 
        bordered="state.border"
        decimalSeparator="state.decimalSeparator"
        keyboard="state.keyboard"
        readonly="state.readonly"
    >
        <t t-set-slot="addonBefore">
            金额
        </t>
        <t t-set-slot="addonAfter">
            <div>整</div>
        </t>
        <t t-set-slot="prefix">
            <div>￥</div>
        </t>
        <t t-set-slot="suffix">
            <div>元</div>
        </t>
    </InputNumber>
</div>
    `
}
