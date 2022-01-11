import React, {FC} from "react";
import {Box, ButtonBase, Paper, Stack, Typography} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface CreateQueueCardProps {
    clickHandler: any;
}

/**
 * CreateQueueCard is a clickable card that is apart of the home page queue grid. Triggers the CreateQueueDialog.
 */
const CreateQueueCard: FC<CreateQueueCardProps> = ({clickHandler}) => {
    return <Paper variant="outlined" sx={{overflow: 'hidden'}}>
        <ButtonBase onClick={clickHandler} sx={{width: "100%", textAlign: "left"}} focusRipple>
            <Box width="100%" height={125} p={2} color="#fff" sx={{bgcolor: "#172c35"}}>
                <Typography variant="body1" noWrap>
                    Create a New Queue
                </Typography>

                <Typography variant="h5" fontWeight={600}>
                    New Queue
                </Typography>
            </Box>
        </ButtonBase>

        <Box width="100%" p={2} color={"#777777"}>
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AddCircleIcon />
                </Stack>
            </Stack>
        </Box>
    </Paper>;
};

export default CreateQueueCard;


