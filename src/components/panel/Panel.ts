import { Component, useEffect, useState, useSubEnv, xml } from '@odoo/owl';
import { baseProps, BaseProps } from '@/common/baseProps';
import './style/panel.scss';
import Group, { GroupProps } from './Group';
import Input from '@/components/input';
import { getPrefixCls } from '@/components/_util/utils';
import { useImperativeHandle } from '@/hooks/useImperativeHandle';

type Props = {
    data: GroupProps[];
    onSearch: (value: string) => void;
    forceRefreshWhenDataChange?: boolean;
} & BaseProps;

class Panel extends Component<Props> {
    static components = { Group, Input };

    static props = {
        data: { type: Array, optional: true },
        onSearch: { type: Function, optional: true },
        forceRefreshWhenDataChange: { type: Boolean, optional: true },
        ...baseProps
    };

    static defaultProps = {
        data: []
    };

    state = useState({
        renderCount: 0,
        closeStateMap: {}
    });

    static template = xml`
<div class="${getPrefixCls('panel-container')}">
    <Input t-if="props.onSearch" className="'${getPrefixCls('panel-search')}'" onChange="props.onSearch"/>
    <t t-foreach="props.data" t-as="group" t-key="state.renderCount + group.name">
        <Group name="group.name" isClose="state.closeStateMap[group.name]" properties="group.properties" onToggleOpen="() => this.handleToggleOpen(group.name)"/>
    </t>
</div>
`;
    handleToggleOpen(groupName: string){
        this.state.closeStateMap[groupName] = !this.state.closeStateMap[groupName];
    }

    forceRefresh() {
        this.state.renderCount++;
    }

    public setup(): void {
        useSubEnv({
            getPanel: () => this
        });

        useImperativeHandle(() => ({
            forceRefresh: this.forceRefresh.bind(this)
        }), () => []);

        useEffect(() => {
            if (this.props.forceRefreshWhenDataChange) {
                this.forceRefresh();
            }
        }, () => [this.props.data]);
    }
}

export default Panel;
