import {Chip, useTheme} from "@mui/material";
import { tokens } from "../theme.jsx";
import ProgressCircle from "./ProgressCircle";
import Avatar from "@mui/material/Avatar";
import {CheckCircle} from "@mui/icons-material";

const ButtonChip = ({ info, showError, labelSuccess, labelError, handlerBtnChip}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      {showError && <Chip color="error" label={labelError} sx={{mr: "10px"}}
                          onClick={()=>{
                            if(handlerBtnChip === undefined)
                              return false;
                            handlerBtnChip();
                          }}
            avatar={<Avatar sx={{
              backgroundColor: "#fff",
              color: `#000 !important`,
              fontWeight: `bold`
            }}>{info}</Avatar>}
      />}
      {!showError && <Chip
          sx={{
            mr: "10px",
            '.MuiChip-deleteIcon': {
              color: "#fff",
            }
          }}
          color="success" label={labelSuccess}
          onClick={()=>{}}
          onDelete={()=>{}}
          deleteIcon={<CheckCircle />}
      />}
    </>
  );
};

export default ButtonChip;
