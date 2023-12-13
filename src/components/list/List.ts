import { Component, useState, xml } from '@odoo/owl';
import Item from '@/components/list/Item';
import VirtualList from '@/components/list/VirtualList';

type Props = {
    dataSource: any[]
}

class List extends Component<Props> {
    static components = { Item, VirtualList };

    static defaultProps = {
        dataSource: []
    };

    static template = xml`
<div>
    <t t-slot="header"/>
    <t t-slot="default"/>
    <VirtualList list="props.dataSource" itemHeight="30">
        <t t-set-slot="renderItem" t-slot-scope="scope">
            <t t-slot="renderItem" t-props="scope">
                <div t-att-style="scope.style"><t t-esc="scope.index"></t></div>
            </t>
        </t>
    </VirtualList>
    <t t-slot="footer"/>
</div>   
    `;

    state = useState({});

    public setup(): void {
    }
}

export default List;
