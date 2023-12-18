import { Col, Row } from '@/components/grid';
import Input from '@/components/input';
import InputNumber from '@/components/input-number/InputNumber';
import List from '@/components/list/List';
import Select from '@/components/select/Select';
import { setThemes } from '@/theme/theme';

setThemes('#71639e');

const __info__ = {
    version: window.__OWL_VERSION__,
    date: window.__BUILD_DATE__
};

export {
    __info__,
    Row,
    Col,
    Input,
    List,
    Select,
    InputNumber
};
