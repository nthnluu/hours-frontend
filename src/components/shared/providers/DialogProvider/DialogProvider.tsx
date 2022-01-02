import {FC, useState} from "react";
import {AlertDialogConfig, DialogContext, DialogTypes} from "../../../../util/hooks/useDialog";
import AlertDialog from "../../dialogs/AlertDialog";


/**
 * Sets up the useDialog() hook
 */
const DialogProvider: FC = ({children}) => {
    const [currentDialog, setCurrentDialog] = useState<DialogTypes | undefined>();
    const [dialogConfig, setDialogConfig] = useState<AlertDialogConfig | undefined>();

    function closeDialog() {
        setCurrentDialog(undefined);
    }

    function openAlertDialog(config: AlertDialogConfig) {
        setDialogConfig(config);
        setCurrentDialog(DialogTypes.ALERT);
    }

    function isOpen(dialogType: DialogTypes) {
        return currentDialog === dialogType;
    }

    return <DialogContext.Provider value={{closeDialog, openAlertDialog}}>
        <AlertDialog open={isOpen(DialogTypes.ALERT)}
                     onClose={closeDialog}
                     title={dialogConfig?.title}
                     description={dialogConfig?.description}/>
        {children}
    </DialogContext.Provider>;
};

export default DialogProvider;


