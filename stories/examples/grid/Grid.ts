import { Component, useState, xml } from '@odoo/owl';
import { Col, Row } from '../../../src';
import './grid.scss';

export default class GridRoot extends Component {
    static components = { Row, Col };

    state = useState({
        span1: 0,
        span2: 0,
        span3: 0,
        gutter: 0,
        offset: 0,
        justify: 'start',
        align: 'top',
        order: 0,
        flex: 2,
        wrap: undefined,
    });

    static template = xml`
<div class="row-container">
    <Row className="'row'" gutter="state.gutter" justify="state.justify" align="state.align" wrap="state.wrap">
        <Col className="'col'" span="state.span1">
            col-<t t-esc="state.span1"/>
        </Col>
        <Col className="'col'" span="state.span2" order="state.order">
            col-<t t-esc="state.span2"/>
        </Col>
        <Col className="'col'" span="state.span3" offset="state.offset">
            col-<t t-esc="state.span3"/>
        </Col>
    </Row>
</div>
<h4>Flex填充</h4>
<div class="row-container">
    <Row className="'row'">
        <Col className="'col'" flex="1">
            flex-1
        </Col>
        <Col className="'col'" span="state.flex">
            col-<t t-esc="state.flex"/>
        </Col>
    </Row>
</div>    
<h4>响应式布局</h4>
<div class="row-container">
    <Row className="'row'">
        <Col className="'col'" xs="{ span: 5, offset: 10 }" lg="{ span: 12, offset: 2 }">
            xs和lg
        </Col>
        <Col className="'col'" span="5">
            col-5
        </Col>
    </Row>
</div>   
    `
}
