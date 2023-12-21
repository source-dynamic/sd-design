import { Component, useState, xml } from '@odoo/owl';
import { Select } from '../../../src';
import './select.scss';

export default class SelectRoot extends Component {
    static components = { Select };

    state = useState({
        disabled: false,
        size: undefined,
        bordered: undefined,
        showSearch: undefined
    });

    customState = useState({
        options: Array.from({ length: 50 }, (_, index) => ({
            label: `选项${index}`,
            value: `value${index}`
        }))
    })

    static template = xml`
<div class="select-container">
    <Select disabled="state.disabled" size="state.size" showSearch="state.showSearch" bordered="state.bordered" options="customState.options"/>
</div>
    `
}
