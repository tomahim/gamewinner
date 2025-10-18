import "./FormButton.scss";

function FormButton({ label }: { label: string }) {
  return (
    <div className="form-button">
      <button type="submit">{label}</button>
    </div>
  );
}

export default FormButton;
