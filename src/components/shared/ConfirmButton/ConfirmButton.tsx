import {FC} from "react";
import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import Button from "@components/shared/Button";

export interface ConfirmButtonProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmButton: FC<ConfirmButtonProps> = ({open, onClose, onConfirm, message, children}) => {
    return (<>
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        {children}
    </>);
};

export default ConfirmButton;