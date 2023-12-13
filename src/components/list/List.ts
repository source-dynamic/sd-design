import { Component, useEffect, useRef, useState, xml } from '@odoo/owl';
import Item from '@/components/list/Item';
import { useVirtualList } from '@/hooks/useVirtualList';

type Props = {
    dataSource: any[]
}

class List extends Component<Props> {
    static components = { Item };

    static defaultProps = {
        dataSource: []
    }

    static template = xml`
<div>
    <t t-slot="header"/>
    <t t-slot="default"/>
    <div t-ref="container">
        <div t-ref="wrapper">
            <t t-foreach="virtualList.list" t-as="data" t-key="data_index">
                <t t-slot="renderItem" item="data" index="data_index">
                    <div>
                        <t t-esc="data_index"/>
                    </div>
                </t>
            </t>
        </div>
    </div>
    <t t-slot="footer"/>
</div>   
    `;

    containerRef = useRef<HTMLDivElement>('container');
    wrapperRef = useRef<HTMLDivElement>('wrapper');
    state = useState({});
    virtualList = {};

    public setup(): void {
        this.virtualList = useVirtualList(this.props.dataSource, {
            containerTarget: this.containerRef.el!,
            wrapperTarget: this.wrapperRef.el!,
            itemHeight: 50
        })

        useEffect(() => {
            console.log(this.props.dataSource.length);
        }, () => [this.props.dataSource])
    }
}

export default List;
