import React, {FC, useState} from "react";
import {Box, Paper, Stack, Typography} from "@mui/material";
import {Queue} from "@util/queue/api";
import getQueueColor from "@util/shared/getQueueColor";
import QueueStatusChip from "@components/queue/QueueStatusChip";
import IconButton from "@components/shared/IconButton";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {useAuth} from "@util/auth/hooks";
import AuthAPI from "@util/auth/api";
import {toast} from "react-hot-toast";

export interface QueuePageHeaderProps {
    queue: Queue;
}

const QueuePageHeader: FC<QueuePageHeaderProps> = ({queue}) => {
    const {currentUser} = useAuth();
    const [isFavorite, setIsFavorite] = useState(currentUser?.favoriteCourses?.includes(queue.course.id) as boolean);

    function onFavoriteCourse() {
        setIsFavorite(true);
        AuthAPI.addFavoriteCourse(queue.course.id)
            .then(() => toast(`Added ${queue.course.code} to your favorites`))
            .catch(() => setIsFavorite(false));
    }

    function onUnfavoriteCourse() {
        setIsFavorite(false);
        AuthAPI.removeFavoriteCourse(queue.course.id)
            .then(() => toast(`Removed ${queue.course.code} from your favorites`))
            .catch(() => setIsFavorite(true));

    }

    return <Paper sx={{overflow: "hidden"}}>
        <Box width="100%" p={[2, null, 3]} color="#fff" position="relative" sx={{bgcolor: getQueueColor(queue)}}>
            <Box height={120}>
            </Box>
            <Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body1" noWrap>
                        {queue.course.code}: {queue.course.title}
                    </Typography>
                    {isFavorite ?
                        <IconButton color="inherit" label="Remove from favorites" size="small" onClick={onUnfavoriteCourse}>
                            <BookmarkIcon/>
                        </IconButton> :
                        <IconButton color="inherit" label="Add to favorites" size="small" onClick={onFavoriteCourse}>
                            <BookmarkBorderIcon/>
                        </IconButton>}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        {queue.title}
                    </Typography>
                    <QueueStatusChip queue={queue} size="medium"/>
                </Stack>
            </Box>
        </Box>
    </Paper>;
};

export default QueuePageHeader;


