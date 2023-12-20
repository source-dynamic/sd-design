import { Component, useState, xml } from '@odoo/owl';
import { InputNumber, List } from '../../../src';
import './list.scss';
import { Position } from '../../../src/components/list/VirtualList';

export default class ListRoot extends Component {
    static components = { List, InputNumber };

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
        largeList: Array.from({ length: 50 }, (_, i) => ({
            title: `title${i}`,
            content: `content${i}`
        })),
        turnLine: 50
    });

    listRef: any = { current: null };

    /**
     * 跳转到指定行
     */
    handleTurn() {
        this.listRef.current?.scrollTo(this.compState.turnLine)
    }

    /**
     * 修改跳转行回调
     * @param value
     */
    onChangeTurnLine(value) {
        this.compState.turnLine = value;
    }

    /**
     * 虚拟滚动列表滚动回调
     * @param e 事件Event
     * @param position 滚动位置, start | end | mid
     */
    onScroll(e: MouseEvent, position: Position) {
        if (position === 'end') {
            const preIndex = this.compState.largeList.length;
            this.compState.largeList = this.compState.largeList.concat(
                Array.from({ length: 100 }, (_, i) => ({
                    title: `title${preIndex + i}`,
                    content: `content${preIndex + i}`
                }))
            );
        }
    }

    /**
     * 虚拟滚动列表渲染完成回调
     */
    onRendered() {
        console.log(this.compState.largeList.length);
    }

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
        <List ref="listRef" className="'list'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30" 
            onScroll.bind="onScroll" onRendered.bind="onRendered">
            <t t-set-slot="item" t-slot-scope="scope">
                <div>item-<t t-esc="scope.data.title"/></div>
            </t>
        </List>
        <div class="input-container">
            <button t-on-click="handleTurn">跳转到</button>
            <InputNumber value="compState.turnLine" onChange.bind="onChangeTurnLine">
                <t t-set-slot="addonAfter">行</t>
            </InputNumber>
        </div>
    </t>
</div>   
    `;
}
