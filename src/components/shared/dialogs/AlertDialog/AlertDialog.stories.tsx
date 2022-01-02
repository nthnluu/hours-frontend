import React, {useState} from 'react';
import {ComponentMeta} from '@storybook/react';
import Dialog, {AlertDialogProps} from "./AlertDialog";
import Button from "../../Button";

export default {
    title: 'Components/AlertDialog',
    component: Dialog
} as ComponentMeta<typeof Dialog>;

function AlertDialog({title, description}: { title: string; description: string; }) {
    const [open, setOpen] = useState(false);
    return <div>
        <Button variant="contained" onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open}
                onClose={() => setOpen(false)}
                title={title}
                description={description}/>
    </div>;
}

export const alertDialog = ({
                                title = "This is a pretty little alert!",
                                description = "Something urgent has occurred."
                            }: AlertDialogProps) => <AlertDialog title={title} description={description}/>;