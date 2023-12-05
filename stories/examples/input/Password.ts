import { Component, useState, xml } from '@odoo/owl';
import { Input } from '../../../src';

export default class PasswordRoot extends Component {
    static components = { Password: Input.Password };

    state = useState<any>({
        allowClear: true,
        prefix: '',
        suffix: '',
        addonBefore: '',
        addonAfter: '',
        size: undefined,
        bordered: undefined,
        disabled: undefined,
        visible: undefined
    });

    protected onVisibleChange = (visible: boolean) => {
        this.state.visible = visible;
    }

    static template = xml`
<div class="input-container">
    <Password visible="state.visible" onVisibleChange="onVisibleChange" placeholder="'Password'" size="state.size" bordered="state.bordered" disabled="state.disabled"/>
</div>
    `
}
