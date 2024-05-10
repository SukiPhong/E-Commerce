const ConfirmLeavePageAlert = () => {
  const Swal = require("sweetalert2");

  const showLeavePageAlert = () => {
    Swal.fire({
      title: "Bạn có chắc muốn rời khỏi trang?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thoát",
      cancelButtonText: "Ở lại",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "https://example.com";
      }
    });
  };

  return showLeavePageAlert;
};

export default ConfirmLeavePageAlert;
