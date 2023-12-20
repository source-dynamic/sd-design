import { Component, useState, xml } from '@odoo/owl';
import { Select } from '../../../src';
import './select.scss';

export default class SelectRoot extends Component {
    static components = { Select };

    state = useState({
        disabled: false,
        size: undefined,
        bordered: undefined
    });

    static template = xml`
<div class="select-container">
    <Select disabled="state.disabled" size="state.size" bordered="state.bordered"/>
</div>
    `
}
