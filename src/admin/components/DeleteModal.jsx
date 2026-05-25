import ConfirmModal from "./ConfirmModal";

function DeleteModal({ open = true, itemName = "this item", onClose, onDelete }) {
  return (
    <ConfirmModal
      open={open}
      title="Delete item?"
      description={`Delete ${itemName}? This is a visual shell only, but future destructive actions should be confirmed here.`}
      confirmLabel="Delete"
      cancelLabel="Keep item"
      onClose={onClose}
      onConfirm={onDelete}
    />
  );
}

export default DeleteModal;
