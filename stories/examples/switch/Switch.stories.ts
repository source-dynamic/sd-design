import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import SwitchCompRaw from '!!raw-loader!./Switch';
import SwitchComp from './Switch';
import './switch.scss';

const meta: Meta = {
    title: '数据录入/Switch 开关',
    parameters: {
        layout: 'auto'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Switch: Story = {
    args: {
        disabled: false,
        size: 'default',
        loading: false
    },
    argTypes: {
        disabled: {
            description: '禁用状态'
        },
        size: {
            description: '尺寸',
            control: 'select',
            options: ['small', 'default']
        },
        loading: {
            description: '加载中状态'
        }
    },
    parameters: {
        docs: {
            source: {
                code: SwitchCompRaw
            }
        }
    },
    render: renderStoryComp(SwitchComp)
};
