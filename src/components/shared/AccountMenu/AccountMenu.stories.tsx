import React from 'react';
import {ComponentMeta} from '@storybook/react';
import AccountMenu, {AccountMenuProps} from "./AccountMenu";
import {testUser} from "../../../util/auth/auth_helpers";

export default {
    title: 'Components/AccountMenu',
    component: AccountMenu
} as ComponentMeta<typeof AccountMenu>;

export const accountMenu = (args: AccountMenuProps) => <AccountMenu {...args} user={testUser()}/>;