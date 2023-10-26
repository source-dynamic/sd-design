import React, { FC, useEffect, useRef } from 'react';
import { mount } from '@odoo/owl';

type ComponentType = any;

export type Props = Record<string, any> & { owl: ComponentType };

export const StoryComp: FC<Props> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const owlRootRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<ComponentType>(null);

    useEffect(() => {
        if (owlRootRef.current) {
            mount(props.owl, owlRootRef.current).then((root) => {
                rootRef.current = root;
            });
        }
    }, [owlRootRef]);

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.state = props;
        }
    }, [props]);

    return (
        <div ref={containerRef}>
            <div ref={owlRootRef}/>
            dsdsd
        </div>
    );
};

export function renderStoryComp(owlComponent: ComponentType, args: Record<string, any>) {
    return <StoryComp {...args} owl={owlComponent}/>;
}
