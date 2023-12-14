import { Component, useState, xml } from '@odoo/owl';
import { List } from '../../../src';
import './list.scss';

export default class ListRoot extends Component {
    static components = { List };

    state = useState<any>({
        bordered: true,
        size: 'middle',
        virtual: false
    });

    compState = useState({
        list: Array.from({ length: 50 }, (_, i) => ({
            title: `title${i}`,
            content: `content${i}`
        })),
        largeList: Array.from({ length: 10000 }, (_, i) => ({
            title: `title${i}`,
            content: `content${i}`
        }))
    })

    static template = xml`
<div class="list-container">
    <!-- 普通列表  -->
    <t t-if="!state.virtual">
        <List className="'list'" dataSource="compState.list" bordered="state.bordered" size="state.size">
            <t t-set-slot="header">
                header
            </t>
            <t t-set-slot="footer">
                footer
            </t>
            <t t-set-slot="item" t-slot-scope="scope">
                item-<t t-esc="scope.data.title"/>
            </t>
        </List>
    </t>
    <t t-else="">
        <!-- 虚拟滚动列表  -->
        <List className="'list overflow-hidden'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30">
            <t t-set-slot="item" t-slot-scope="scope">
                <div>item-<t t-esc="scope.data.title"/></div>
            </t>
        </List>
    </t>
</div>   
    `
}
