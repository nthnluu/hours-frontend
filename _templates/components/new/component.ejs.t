---
to: src/components/<%=h.changeCase.pascalCase(name)%>/<%=h.changeCase.pascalCase(name)%>.tsx
---
import {FC} from "react";

export interface <%=h.changeCase.pascalCase(name)%>Props {
    /** Lorem ipsum dolor sit anem... */
    foo: string;
}

/**
 * Write a short description of this component here...
 */
const <%=h.changeCase.pascalCase(name)%>: FC<<%=h.changeCase.pascalCase(name)%>Props> = (props) => {
    return <h1>{props.foo}</h1>;
};

export default <%=h.changeCase.pascalCase(name)%>;


