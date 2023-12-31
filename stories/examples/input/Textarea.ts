import { Component, useState, xml } from '@odoo/owl';
import { Input } from '../../../src';

export default class TextareaRoot extends Component {
    static components = { TextArea: Input.TextArea };

    state = useState<any>({
        allowClear: true,
        size: undefined,
        bordered: undefined,
        disabled: undefined,
        showCount: undefined,
        autoSize: undefined,
        rows: 2
    });

    innerState = useState({
        value: '',
        ref: {}
    });

    protected onChange = (value: string) => {
        this.innerState.value = value;
    };

    static template = xml`
<div class="input-container">
    <TextArea 
        rows="state.rows"
        value="innerState.value" 
        placeholder="'TextArea'" 
        onChange.bind.alike="onChange"  
        autoSize="state.autoSize"
        showCount="state.showCount" 
        allowClear="state.allowClear" 
        size="state.size" 
        bordered="state.bordered" 
        disabled="state.disabled"
    />
</div>
    `;
}
