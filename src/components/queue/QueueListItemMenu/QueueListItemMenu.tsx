import React, {FC, useState, MouseEvent} from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@components/shared/IconButton";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import QueueList from "../QueueList/QueueList";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface QueueListItemMenuProps {
    isClaimed: boolean;
    isTA: boolean;
    isTicketOwner: boolean;
    setEditTicketDialog: (arg0: boolean) => void;
    ticket: Ticket;
    queueID: string;
    allowTicketEditing: boolean;

}

const QueueListItemMenu: FC<QueueListItemMenuProps> = ({
                                                           isClaimed,
                                                           isTA,
                                                           isTicketOwner,
                                                           ticket,
                                                           queueID,
                                                           allowTicketEditing,
                                                           setEditTicketDialog
                                                       }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleEditTicket = () => {
        handleClose();
        setEditTicketDialog(true);
    };

    const handleMarkAsCompleted = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, ticket.user.UserID, queueID, TicketStatus.StatusComplete, ticket.description)
            .catch(() => {
                toast.error(errors.UNKNOWN);
            });
    };

    const handleMarkAsMissing = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, ticket.user.UserID, queueID, TicketStatus.StatusMissing, ticket.description)
            .catch(() => {
                toast.error(errors.UNKNOWN);
            });
    };

    const handleReturnToQueue = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, ticket.user.UserID, queueID, TicketStatus.StatusWaiting, ticket.description)
            .catch(() => {
                toast.error(errors.UNKNOWN);
            });
    };

    const handleDeleteTicket = () => {
        handleClose();
        const confirmed = confirm("Are you sure you want to delete this ticket?");

        if (confirmed) {
            QueueAPI.deleteTicket(ticket.id, queueID, ticket.status, isTA)
                .catch(() => {
                    toast.error(errors.UNKNOWN);
                });
        }
    };

    const buttonID = `ticket-${ticket.id}-button`;
    const menuID = `ticket-${ticket.id}-menu`;

    return <div>
        <IconButton
            label="More options"
            id={buttonID}
            aria-controls={open ? menuID : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            disabled={isTicketOwner && isClaimed}>
            <MoreHorizIcon/>
        </IconButton>
        <Menu
            id={menuID}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': buttonID,
            }}>
            {isTicketOwner && allowTicketEditing && !isClaimed && <MenuItem onClick={handleEditTicket}>
                <ListItemIcon>
                    <EditIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Edit Ticket</ListItemText>
            </MenuItem>}
            {isTA && <MenuItem onClick={handleMarkAsCompleted}>
                <ListItemIcon>
                    <CheckIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Mark as completed</ListItemText>
            </MenuItem>}
            {isTA && <MenuItem onClick={handleMarkAsMissing}>
                <ListItemIcon>
                    <QuestionMarkIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Mark as missing</ListItemText>
            </MenuItem>}
            {isTA && isClaimed && <MenuItem onClick={handleReturnToQueue}>
                <ListItemIcon>
                    <UndoIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Return to queue</ListItemText>
            </MenuItem>}
            {(isTA || (isTicketOwner && !isClaimed)) && <MenuItem onClick={handleDeleteTicket}>
                <ListItemIcon>
                    <CloseIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Delete ticket</ListItemText>
            </MenuItem>}
        </Menu>
    </div>;
};

export default QueueListItemMenu;


