import React, {FC} from "react";
import {Box, ButtonBase, Paper, Stack, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export interface CreateQueueCardProps {
    clickHandler: any;
}

/**
 * CreateQueueCard is a clickable card that is apart of the home page queue grid. Triggers the CreateQueueDialog.
 */
const CreateQueueCard: FC<CreateQueueCardProps> = ({clickHandler}) => {
    return <Paper variant="outlined" sx={{overflow: "hidden", height: "100%"}}>
        <ButtonBase onClick={clickHandler} sx={{width: "100%", height: "100%", textAlign: "left"}} focusRipple>
            <Box width="100%">
                <Stack alignItems="center" justifyContent="center" height="100%">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <AddIcon/>
                        <Typography>
                            New Queue
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        </ButtonBase>
    </Paper>;
};

export default CreateQueueCard;


