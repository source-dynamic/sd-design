import { Component, useState, xml } from '@odoo/owl';
import { Input } from '../../../src';

export default class TextareaRoot extends Component {
    static components = { TextArea: Input.TextArea };

    state = useState<any>({
        allowClear: true,
        prefix: '',
        suffix: '',
        addonBefore: '',
        addonAfter: '',
        size: undefined,
        border: undefined,
        disabled: undefined,
        showCount: undefined,
        autoSize: undefined,
        rows: 1
    });

    protected onChange = (value: string) => {
        console.log(value);
    }

    static template = xml`
<div class="input-container">
    <TextArea placeholder="'TextArea'" onResize.bind.alike="onChange"  autoSize="state.autoSize" showCount="state.showCount" allowClear="state.allowClear" size="state.size" bordered="state.border" disabled="state.disabled"/>
</div>
    `
}
