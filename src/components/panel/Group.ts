import { Component, xml } from '@odoo/owl';
import arrowSVG from '@/assets/arrow.svg';
import { getPrefixCls } from '@/components/_util/utils';
import classNames from 'classnames';

type Property = {
    label: string;
    component?: () => any;
    required?: () => boolean;
    validate?: () => string;
    props: () => Record<string, any>;
}

export type GroupProps = {
    name: string;
    properties: Property[];
    isClose?: boolean;
    onToggleOpen?: () => void;
};

class Group extends Component<GroupProps> {
    static props = {
        name: { type: String },
        properties: { type: Array },
        isClose: { type: Boolean, optional: true },
        onToggleOpen: { type: Function, optional: true }
    };

    static defaultProps = {
        isClose: false
    };

    static template = xml`
<div t-att-class="getGroupClass()" t-if="props.properties.length > 0">
    <div class="${getPrefixCls('panel-group-title')}" t-on-click.stop="props.onToggleOpen">
        <span><t t-esc="props.name"/></span>
        <span class="${getPrefixCls('panel-group-arrow')}">${arrowSVG}</span>
    </div>
    <div class="${getPrefixCls('panel-group-property')}">
        <t t-foreach="props.properties" t-as="property" t-key="property.label">
            <div t-att-class="this.getPropertyClass(property)">
                <div class="${getPrefixCls('panel-property-title')}">
                    <t t-esc="property.label"/>
                </div>
                <t t-set="component" t-value="property.component?.()"/>
                <t t-if="component" t-component="component" t-props="property.props()"/>
                <t t-set="validateMessage" t-value="property.validate?.()"/>
            </div>
        </t>
    </div>
</div>  
`;

    getGroupClass() {
        return classNames(getPrefixCls('panel-group'), {
            [getPrefixCls('panel-group-close')]: this.props.isClose
        });
    }

    getPropertyClass(property: Property) {
        return classNames(
            getPrefixCls('panel-property'), {
                [getPrefixCls('panel-property-required')]: property.required
            });
    }
}

export default Group;
