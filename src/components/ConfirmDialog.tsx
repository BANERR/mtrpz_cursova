interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <div className="confirm-dialog">
      <p>{message}</p>
      <div className="buttons">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}; 