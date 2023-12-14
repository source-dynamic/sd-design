import { Component, useState, xml } from '@odoo/owl';
import { List } from '../../../src';
import './list.scss';

export default class ListRoot extends Component {
    static components = { List };

    state = useState<any>({
        list: []
    });

    static template = xml`
<div class="list-container">
    <List className="'list'" dataSource="state.list" size="'small'" virtual="true" itemHeight="30">
        <t t-set-slot="header">
            232323
        </t>
        <t t-set-slot="footer">
            2323231
        </t>
        <t t-set-slot="item">
            2323231item
        </t>
    </List>
</div>   
    `

    public setup(): void {
        this.state.list = Array.from({ length: 500 }, (_, i) => ({
            title: `title${i}`,
            content: `content${i}`
        }));
    }
}
