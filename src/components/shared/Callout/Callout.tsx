import React, {FC} from "react";
import {Box, Popover, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";

export interface CalloutProps {
    isOpen: boolean;
    title: string;
    body: string;
    anchorComponent: any;
    onContinue: () => void;
    onClose: () => void;
    continueButtonLabel: string;
}

const Callout: FC<CalloutProps> = ({
                                       isOpen,
                                       title,
                                       body,
                                       onClose,
                                       onContinue,
                                       continueButtonLabel,
                                       anchorComponent
                                   }) => {
    function handleContinue() {
        onContinue();
        onClose();
    }

    return <Popover
        open={isOpen}
        anchorEl={anchorComponent}
        onClose={onClose}
        PaperProps={{sx: {bgcolor: "#1459e1"}}}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        <Box sx={{p: 2.5, color: "white"}} width={350}>
            <Typography variant="h6" sx={{lineHeight: 1.5}}>
                {title}
            </Typography>
            <Typography my={1} variant="body2">
                {body}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="end" mt={2}>
                <Button color="inherit" onClick={onClose}>
                    Do it later
                </Button>
                <Button color="inherit" variant="contained" sx={{color: "#1459e1"}} onClick={handleContinue}>
                    {continueButtonLabel}
                </Button>
            </Stack>
        </Box>
    </Popover>;
};

export default Callout;


