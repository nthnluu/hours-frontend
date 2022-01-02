---
to: src/components/<%=h.changeCase.pascalCase(name)%>/<%=h.changeCase.pascalCase(name)%>.test.tsx
---
import <%=h.changeCase.pascalCase(name)%> from "./<%=h.changeCase.pascalCase(name)%>";
import {render} from "@testing-library/react";

describe('lorem ipsum...', () => {
    it('should be followed with dolor sit anem', () => {
        render(<<%=h.changeCase.pascalCase(name)%> foo="asdf" />);
    });
});
