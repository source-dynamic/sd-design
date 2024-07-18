import { Component, useState, xml } from '@odoo/owl';
import { Panel } from '../../../src';
import './panel.scss';
import Input from '@/components/input/Input';

export default class PanelRoot extends Component {
    static components = { Panel };

    state = useState<any>({
        forceRefreshWhenDataChange: false
    });

    compState = useState<any>({
        data: [
            {
                name: 'SequenceFlow',
                properties: [
                    {
                        label: 'ConditionExpression',
                        component: () => Input,
                        required: () => true,
                        props: () => ({
                            value: '2',
                            onChange: (value) => {
                                console.log('onChange', value);
                            }
                        })
                    },
                    {
                        label: 'ConditionExpression2',
                        component: () => Input,
                        required: () => true,
                        props: () => ({
                            value: '2',
                            onChange: (value) => {
                                console.log('onChange', value);
                            }
                        })
                    }
                ]
            }
        ]
    })

    onSearch(value) {
        console.log('onSearch', value);
    }

    static template = xml`
<div class="panel-container">
    <Panel ref="panelRef" data="compState.data" onSearch.bind="onSearch" forceRefreshWhenDataChange="state.forceRefreshWhenDataChange"/>
</div>   
    `;
}
