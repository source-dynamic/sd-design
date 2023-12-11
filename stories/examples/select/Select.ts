import { Component, useState, xml } from '@odoo/owl';
import { Select } from '../../../src';

export default class SelectRoot extends Component {
    static components = { Select };

    state = useState({
    });

    static template = xml`
<div class="container">
    <Select/>
</div>
    `
}
