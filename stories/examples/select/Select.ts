import { Component, useState, xml } from '@odoo/owl';
import { Select } from '../../../src';
import './select.scss';

export default class SelectRoot extends Component {
    static components = { Select };

    state = useState({
    });

    static template = xml`
<div class="select-container">
    <Select/>
</div>
    `
}
