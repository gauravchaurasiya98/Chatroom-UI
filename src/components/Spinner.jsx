import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className={`spinner-border ${styles.spinner}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
