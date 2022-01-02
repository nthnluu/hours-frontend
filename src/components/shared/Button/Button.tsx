import {FC} from "react";
import {Box, ButtonProps as MuiButtonProps, CircularProgress, Tooltip} from "@mui/material";
import MuiButton from "@mui/material/Button";

export interface ButtonProps extends MuiButtonProps {
    /** Additional text to be displayed when the button is hovered. */
    tooltip?: string;
    /** Disables the button and displays a loading indicator. */
    loading?: boolean;
}

const Button: FC<ButtonProps> = ({tooltip = "", loading, ...props}) => {
    return <Box sx={{ position: 'relative', width: "auto" }}>
        <Tooltip title={tooltip}>
            <MuiButton {...props} disabled={loading}/>
        </Tooltip>
        {loading && <CircularProgress
            thickness={5}
            size={24}
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
            }}
        />}
    </Box>;
};

export default Button;