import { Component, useState, xml } from '@odoo/owl';
import { Input } from '../../../src';
import './input.scss';

export default class InputRoot extends Component {
    static components = { Input };

    state = useState({
        allowClear: true,
        showCount: false,
        prefix: '',
        suffix: '',
        addonBefore: '',
        addonAfter: '',
        size: undefined,
        border: undefined,
        disabled: undefined
    });

    static template = xml`
<div class="input-container">
    <Input showCount="state.showCount" allowClear="state.allowClear" placeholder="'Basic usage'" size="state.size" bordered="state.border" disabled="state.disabled"/>
</div>

<div class="input-container">
    <Input placeholder="'Prefix And Suffix'" size="state.size">
        <t t-set-slot="prefix">
            <t t-esc="state.prefix"/>
        </t>
        <t t-set-slot="suffix">
            <t t-esc="state.suffix"/>
        </t>
    </Input>
</div>

<div class="input-container">
    <Input placeholder="'AddonBefore And AddonAfter'" allowClear="state.allowClear" size="state.size">
        <t t-set-slot="addonBefore">
            <t t-esc="state.addonBefore"/>
        </t>
        <t t-set-slot="addonAfter">
            <t t-esc="state.addonAfter"/>
        </t>
    </Input>
</div>
    `
}
