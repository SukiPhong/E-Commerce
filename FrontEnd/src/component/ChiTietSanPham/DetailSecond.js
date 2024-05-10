import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DOMPurify from "dompurify";

function createData(chieudai, size) {
  return { chieudai, size };
}

const rows = [
  createData("22 - 22.5", "36"),
  createData("23", "37"),
  createData("23.5 - 24", "38"),
  createData("25", "39"),
  createData("25.5", "40"),
  createData("26-26-5", "41"),
  createData("27-27-5", "42"),
];

const DetailSecond = ({ product }) => {
  return (
    <div className="DetailSecond">
      <div className="second-left">
        <h1>Chi Tiết Sản Phẩm</h1>
        <div
          style={{ margin: "20px", fontSize: "1.5rem" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description),
          }}
        />
      </div>
      <div className="second-right">
        <h1>Hướng Dẫn Chọn Kích Thước</h1>
        <h3>Bảng Size:</h3>
        <TableContainer sx={{ width: 450 }} component={Paper}>
          <Table sx={{ fontWeight: "bold" }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#BA948C" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                  align="center"
                >
                  Chiều dài bàn chân (cm){" "}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                  align="center"
                >
                  Size
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={`${row.chieudai}-${row.size}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    align="center"
                    component="th"
                    scope="row"
                  >
                    {row.chieudai}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    align="center"
                  >
                    {row.size}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="step">
          <p className="step-content">
            <span>Bước 1:</span> Đặt tờ giấy vuông góc với bức tường. Đứng lên
            mảnh giấy với gót chân chạm nhẹ vào tường.
          </p>
          <p className="step-content">
            <span>Bước 2:</span> Đánh dấu đỉnh đầu của ngón chân dài nhất lên
            giấy (nên nhờ một người bạn giúp đỡ).
          </p>
          <p className="step-content">
            <span>Bước 3:</span> Đo khoảng cách từ tường đến điểm đánh dấu. Làm
            tương tự với bàn chân còn lại, so sánh số đo với biểu đồ để chọn
            kích thước phù hợp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailSecond;
