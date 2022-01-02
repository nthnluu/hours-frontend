import {createContext, useContext} from "react";

/** The types of available dialogs. */
export enum DialogTypes {
    "ALERT"
}

/** The config passed into openAlertDialog(). */
export interface AlertDialogConfig {
    title?: string;
    description?: string;
}

/** All of the functions available through the useDialog() hook. */
interface DialogFunctions {
    closeDialog: () => any;
    openAlertDialog: (config: AlertDialogConfig) => void;
}

export const DialogContext = createContext<DialogFunctions>({
    closeDialog: () => {},
    openAlertDialog: () => {},
});

export default function useDialog() {
    return useContext(DialogContext);
}