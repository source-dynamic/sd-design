import { Component, useState, xml } from '@odoo/owl';
import { InputNumber } from '../../../src';

export default class InputRoot extends Component {
    static components = { InputNumber };

    state = useState({
    });

    static template = xml`
<div class="input-container">
    <InputNumber placeholder="'Basic usage'"/>
</div>
    `
}
