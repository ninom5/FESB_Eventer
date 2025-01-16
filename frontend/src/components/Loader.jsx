import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading }) => {
  return (
    loading && (
      <div style={styles.overlay}>
        <ClipLoader color="#ffffff" size={60} />
      </div>
    )
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Siva senka
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Osigurava da je loader iznad svega
  },
};

export default Loader;
