import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DonationDeleteAlert({
  open,
  handleResponse,
}: {
  open: boolean;
  handleResponse: (response: "cancel" | "delete") => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => handleResponse("cancel")}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Permanently delete this donation?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone. The donation will be permanently removed
          from your donation list.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleResponse("cancel")}>Cancel</Button>
        <Button
          onClick={() => handleResponse("delete")}
          color="error"
          autoFocus
          variant="contained"
        >
          Delete it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
