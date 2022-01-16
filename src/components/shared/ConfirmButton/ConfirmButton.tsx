import {FC} from "react";
import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import Button from "@components/shared/Button";

export interface ConfirmButtonProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmButtonText?: string;
    message: string;
}

const ConfirmButton: FC<ConfirmButtonProps> = ({
                                                   open,
                                                   onClose,
                                                   onConfirm,
                                                   confirmButtonText = "Confirm",
                                                   message,
                                                   children
                                               }) => {
    return (<>
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
        {children}
    </>);
};

export default ConfirmButton;