import React from 'react';
import {ComponentMeta} from '@storybook/react';
import Button, {ButtonProps} from "./Button";

export default {
    title: 'Components/Button',
    component: Button
} as ComponentMeta<typeof Button>;

export const button = (args: ButtonProps) => <Button {...args}>Button</Button>;