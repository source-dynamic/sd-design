import { Component, useState, xml } from '@odoo/owl';
import { Input } from '../../../src';
import './input.scss';

export default class InputRoot extends Component {
    static components = { Input };

    state = useState({
        allowClear: true,
        prefix: '',
        suffix: '',
        addonBefore: '',
        addonAfter: '',
        size: undefined
    });

    static template = xml`
<div class="input-container">
    <Input allowClear="state.allowClear" placeholder="'Basic usage'" size="state.size"/>
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
