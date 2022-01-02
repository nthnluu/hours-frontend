import {FC} from "react";
import {IconButtonProps as MuiIconButtonProps, Tooltip} from "@mui/material";
import MuiIconButton from "@mui/material/IconButton";

export interface IconButtonProps extends MuiIconButtonProps {
    /** Text that describes this button */
    label: string;
}

const IconButton: FC<IconButtonProps> = ({label, ...props}) => {
    return <Tooltip title={label} enterDelay={500}>
        <MuiIconButton {...props} aria-label={label}/>
    </Tooltip>;
};

export default IconButton;