import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import SelectCompRaw from '!!raw-loader!./Select';
import SelectComp from './Select';

const meta: Meta = {
    title: '数据录入/Select 选择器',
    parameters: {
        layout: 'auto'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Select: Story = {
    args: {
        disabled: false,
        size: 'middle',
        bordered: true,
        showSearch: false,
        loading: false
    },
    argTypes: {
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
        }
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
