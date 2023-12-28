import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import SelectCompRaw from '!!raw-loader!./Select';
// @ts-ignore
import SelectMultipleCompRaw from '!!raw-loader!./SelectMultiple';
// @ts-ignore
import SelectVirtualCompRaw from '!!raw-loader!./SelectVirtual';
import SelectComp from './Select';
import SelectMultipleComp from './SelectMultiple';
import SelectVirtualComp from './SelectVirtual';
import './select.scss';

const meta: Meta = {
    title: '数据录入/Select 选择器',
    parameters: {
        layout: 'centered'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Select: Story = {
    args: {
        allowClear: false,
        disabled: false,
        size: 'middle',
        bordered: true,
        showSearch: false,
        loading: false,
        placement: 'bottomLeft'
    },
    argTypes: {
        allowClear: {
            description: '是否展示清除按钮'
        },
        disabled: {
            description: '是否禁用'
        },
        bordered: {
            description: '是否有边框'
        },
        size: {
            description: '尺寸',
            control: 'select',
            options: ['small', 'middle', 'large']
        },
        showSearch: {
            description: '是否可对选项进行搜索'
        },
        loading: {
            description: '是否展示加载中状态'
        },
        placement: {
            description: '选择框弹出的位置',
            control: 'select',
            options: ['topLeft' , 'topRight' , 'bottomLeft' , 'bottomRight']
        },
    },
    parameters: {
        docs: {
            source: {
                code: SelectCompRaw
            }
        }
    },
    render: renderStoryComp(SelectComp)
};

export const SelectMultiple: Story = {
    args: Select.args,
    argTypes: Select.argTypes,
    parameters: {
        docs: {
            source: {
                code: SelectMultipleCompRaw
            }
        }
    },
    render: renderStoryComp(SelectMultipleComp)
};

export const SelectVirtual: Story = {
    parameters: {
        docs: {
            source: {
                code: SelectVirtualCompRaw
            }
        }
    },
    render: renderStoryComp(SelectVirtualComp)
};
