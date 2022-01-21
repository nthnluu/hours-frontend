import React, {FC, useState, MouseEvent} from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@components/shared/IconButton";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import {toast} from "react-hot-toast";

export interface QueueListItemMenuProps {
    isClaimed: boolean;
    isTA: boolean;
    isTicketOwner: boolean;
    setEditTicketDialog: (arg0: boolean) => void;
    ticket: Ticket;
    queueID: string;
}

const QueueListItemMenu: FC<QueueListItemMenuProps> = ({
                                                           isClaimed,
                                                           isTA,
                                                           isTicketOwner,
                                                           ticket,
                                                           queueID,
                                                           setEditTicketDialog
                                                       }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleClaimTicket = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description)
            .catch(() => {
                toast.error("Something went wrong, please try again later.");
            });
    };
    const handleEditTicket = () => {
        handleClose();
        setEditTicketDialog(true);
    };
    const handleMarkAsCompleted = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusComplete, ticket.description)
            .catch(() => {
                toast.error("Something went wrong, please try again later.");
            });
    };
    const handleMarkAsMissing = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusMissing, ticket.description)
            .catch(() => {
                toast.error("Something went wrong, please try again later.");
            });
    };
    const handleReturnToQueue = () => {
        handleClose();
        QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusWaiting, ticket.description)
            .catch(() => {
                toast.error("Something went wrong, please try again later.");
            });
    };
    const handleDeleteTicket = () => {
        handleClose();
        const confirmed = confirm("Are you sure you want to delete this ticket?");

        if (confirmed) {
            QueueAPI.deleteTicket(ticket.id, queueID)
                .catch(() => {
                    toast.error("Something went wrong, please try again later.");
                });
        }
    };

    return <div>
        <IconButton
            label="More options"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <MoreHorizIcon/>
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}>
            {isTA && !isClaimed && <MenuItem onClick={handleClaimTicket}>
                <ListItemIcon>
                    <ConfirmationNumberOutlinedIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Claim Ticket</ListItemText>
            </MenuItem>}
            {isTicketOwner && <MenuItem onClick={handleEditTicket}>
                <ListItemIcon>
                    <EditIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Edit Ticket</ListItemText>
            </MenuItem>}
            {isTA && isClaimed && <MenuItem onClick={handleMarkAsCompleted}>
                <ListItemIcon>
                    <CheckIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Mark as completed</ListItemText>
            </MenuItem>}
            {isTA && isClaimed && <MenuItem onClick={handleMarkAsMissing}>
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
            {(isTicketOwner || isTA) && <MenuItem onClick={handleDeleteTicket}>
                <ListItemIcon>
                    <CloseIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Delete ticket</ListItemText>
            </MenuItem>}
        </Menu>
    </div>;
};

export default QueueListItemMenu;


