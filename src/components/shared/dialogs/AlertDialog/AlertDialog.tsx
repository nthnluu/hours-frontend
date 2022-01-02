import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "../../Button";

export interface AlertDialogProps {
    /** Displays the dialog. */
    open: boolean;
    /** Called when the dialog is closed. */
    onClose: () => any;
    /** The text that is displayed at the top of the dialog. */
    title?: string;
    /** The text that is displayed below the title. */
    description?: string;
    /** The text to be displayed on the cancel button. */
    cancelButtonLabel?: string;
    /** The text to be displayed on the acknowledge button. */
    acknowledgeButtonLabel?: string;
}

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
const AlertDialog: FC<AlertDialogProps> = ({
                                               open,
                                               onClose,
                                               title,
                                               description,
                                               acknowledgeButtonLabel = "Okay",
                                               cancelButtonLabel = "Cancel"
                                           }) => {
    function handleClose() {
        onClose();
    }

    return <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        {title && <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>}
        {description && <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {description}
            </DialogContentText>
        </DialogContent>}
        <DialogActions>
            <Button onClick={handleClose}>{cancelButtonLabel}</Button>
            <Button variant="contained" onClick={handleClose} autoFocus>
                {acknowledgeButtonLabel}
            </Button>
        </DialogActions>
    </Dialog>;
};

export default AlertDialog;


