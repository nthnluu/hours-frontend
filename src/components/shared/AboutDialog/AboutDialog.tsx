import {FC} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Typography
} from "@mui/material";

export interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog: FC<AboutDialogProps> = ({open, onClose}) => {
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>About Hours</DialogTitle>
        <DialogContent>
            <Stack spacing={2.5} my={1}>
                <Typography>
                    Hours was created by Nathan Luu, Nick Young, and Neil Ramaswamy at Brown University to facilitate
                    office hours for courses in the CS Department and beyond.
                </Typography>
                {/*<Button startIcon={<GitHubIcon/>} color="inherit" variant="outlined"*/}
                {/*        href="https://github.com/nthnluu/hours-frontend/wiki/Contributing">*/}
                {/*    Contribute*/}
                {/*</Button>*/}
            </Stack>
        </DialogContent>
    </Dialog>;
};

export default AboutDialog;


