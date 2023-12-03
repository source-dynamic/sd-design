import { Component, useState, xml } from '@odoo/owl';
import { InputNumber } from '../../../src';

export default class InputRoot extends Component {
    static components = { InputNumber };

    state = useState({
        disabled: false,
        size: 'middle',
        border: true
    });

    static template = xml`
<div class="input-container">
    <InputNumber max="4" min="0" placeholder="'Basic usage'" disabled="state.disabled" size="state.size" bordered="state.border">
        <t t-set-slot="addonAfter">
            <div>.com</div>
        </t>
        <t t-set-slot="addonBefore">
            http://
        </t>
        <t t-set-slot="prefix">
            <div>$</div>
        </t>
        <t t-set-slot="suffix">
            <div>元</div>
        </t>
    </InputNumber>
</div>
    `
}
