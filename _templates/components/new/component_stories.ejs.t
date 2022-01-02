---
to: src/components/<%=h.changeCase.pascalCase(name)%>/<%=h.changeCase.pascalCase(name)%>.stories.tsx
---
import React from 'react';
import {ComponentMeta} from '@storybook/react';
import <%=h.changeCase.pascalCase(name)%>, {<%=h.changeCase.pascalCase(name)%>Props} from "./<%=h.changeCase.pascalCase(name)%>";

export default {
    title: 'Components/<%=h.changeCase.pascalCase(name)%>',
    component: <%=h.changeCase.pascalCase(name)%>
} as ComponentMeta<typeof <%=h.changeCase.pascalCase(name)%>>;

export const <%=h.changeCase.camelCase(name)%> = (args: <%=h.changeCase.pascalCase(name)%>Props) => <<%=h.changeCase.pascalCase(name)%> {...args} />;