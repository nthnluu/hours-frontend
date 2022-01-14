import {FC} from "react";
import {DialogContent} from "@mui/material";

interface TabPanelProps {
    index: number;
    value: number;
}

const TabPanel: FC<TabPanelProps> = ({index, value, children, ...props}) => {
    return <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...props}
    >
        {value === index && (
            <DialogContent>
                {children}
            </DialogContent>
        )}
    </div>;
};

export default TabPanel;


