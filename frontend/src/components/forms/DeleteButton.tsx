import "./DeleteButton.scss";

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="delete-button" onClick={onClick}>
      <button>Delete</button>
    </div>
  );
}

export default DeleteButton;
