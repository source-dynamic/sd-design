import { Component, useState, xml } from '@odoo/owl';
import { Select } from '../../../src';

export default class SelectVirtualRoot extends Component {
    static components = { Select };

    customState = useState({
        options: Array.from({ length: 50000 }, (_, index) => ({
            label: `选项${index}`,
            value: `value${index}`
        }))
    })

    static template = xml`
<div class="select-container">
    <Select allowClear="true" options="customState.options" virtual="true" itemHeight="30"/>
</div>
    `
}
