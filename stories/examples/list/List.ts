import { Component, useState, xml } from '@odoo/owl';
import { List } from '../../../src';

export default class ListRoot extends Component {
    static components = { List };

    state = useState({
        list: []
    });

    static template = xml`
<div class="container">
    <List dataSource="state.list"/>
</div>   
    `

    public setup(): void {
        this.state.list = Array.from({ length: 10000 }, (_, i) => ({
            title: `title${i}`,
            content: `content${i}`
        }));
    }
}
