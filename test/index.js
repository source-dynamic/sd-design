import { Col, Row } from '../src';
import { Component, mount, xml } from '@odoo/owl';
import { ClearableLabeledWrapper } from '../src/components/input';

class Root extends Component {
    static components = { Row, Col, ClearableLabeledInput: ClearableLabeledWrapper };

    static template = xml`
<div>
    <Row>
        <Col md="8">
            col1
        </Col>
        <Col md="8">
            col2
        </Col>
        <Col md="8">
            col3
        </Col>
    </Row>
    <ClearableLabeledInput allowClear="true">
        <t t-set-slot="addonBefore">
          content for footer slot here
        </t>
    </ClearableLabeledInput>
</div>    
    `;
}

mount(Root, document.querySelector('#app'));
