import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Loading = (props: Props) => {
  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CircularProgress color="success" />{" "}
      </Box>
    </Modal>
  );
};

export default Loading;
