import { Col, Row } from '@/components/grid';
import Input from '@/components/input';
import InputNumber from '@/components/input-number/InputNumber';
import { List, VirtualList } from '@/components/list';
import Select from '@/components/select/Select';
import { setThemes } from '@/theme/theme';
import Checkbox from '@/components/checkbox';
import Switch from '@/components/switch/Switch';

setThemes('#71639e');

/**
 * 被rollup打包后，会将__info__打包到js中
 */
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
    VirtualList,
    Select,
    InputNumber,
    Checkbox,
    Switch
};
