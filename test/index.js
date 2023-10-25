import { Row, Col } from '../src';
import { Component, mount, xml } from '@odoo/owl';

class Root extends Component {
    static components = { Row, Col };

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
</div>    
    `;
}

mount(Root, document.querySelector('#app'));
