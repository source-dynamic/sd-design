import React, { useEffect, useRef } from 'react';
import { mount } from '@odoo/owl';

type ComponentType = any;

export type Props = Record<string, any> & { owl: ComponentType };

// todo i18n国际化
/**
 * 提供给storybook渲染的react组件，使owl组件能够在storybook中渲染，同时能保留owl组件的状态，避免每次都是渲染新组件，无法测试到组件状态的变化
 * @param props
 * @constructor
 */
const StoryCompWrapper = (props: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const owlRootRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<ComponentType>(null);

    const changeOwlStateByProps = (owlRoot: ComponentType, props: Props) => {
        for (const key in props) {
            if (owlRoot.state?.hasOwnProperty(key)) {
                owlRoot.state[key] = props[key];
            }
        }
    };

    useEffect(() => {
        if (owlRootRef.current) {
            mount(props.owl, owlRootRef.current, { dev: true, warnIfNoStaticProps: true }).then((root) => {
                rootRef.current = root;
                changeOwlStateByProps(root, props);
            });
        }
    }, [owlRootRef]);

    useEffect(() => {
        if (rootRef.current) {
            changeOwlStateByProps(rootRef.current, props);
        }
    }, [props]);

    return (
        <div ref={containerRef}>
            <div ref={owlRootRef}/>
        </div>
    );
};

/**
 * 提供给storybook的render函数，用于获取待渲染的owl组件的外层react包裹组件
 * 例如：
 * export const Primary: Story = {
 *     ...
 *     render: renderStoryComp(Owl组件类)
 * };
 * @param owlComponent 待渲染的owl组件类
 */
export function renderStoryComp(owlComponent: ComponentType) {
    return (args: Record<string, any>) => <StoryCompWrapper owl={owlComponent} {...args}/>;
}
