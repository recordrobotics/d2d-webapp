import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function UserNameExistsAlert({
  open,
  handleResponse,
}: {
  open: boolean;
  handleResponse: (response: "cancel" | "overwrite") => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => handleResponse("cancel")}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"A user with this name already exists!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          If you proceed, all data associated with the existing user will be
          deleted and overwritten with your local donations. Are you sure you
          want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleResponse("cancel")}>Cancel</Button>
        <Button
          onClick={() => handleResponse("overwrite")}
          color="error"
          autoFocus
          variant="contained"
        >
          Overwrite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
