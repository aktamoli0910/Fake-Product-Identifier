import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Grid, IconButton } from "@mui/material";
import QrCode2 from "@mui/icons-material/QrCode2";
import { ProductContext } from "../../contexts/ProductContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import qrcode from "qrcode";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function SupplierManageProduct() {
  const [products, setProducts] = React.useContext(ProductContext);

  const generateQR = async (id) => {
    try {
      await qrcode.toCanvas(document.getElementById("qrcode"), id, {
        scale: 6,
      });

      window.print();
    } catch (err) {}
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item sx={{ width: "100%" }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Manage Products
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ProductID</StyledTableCell>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell align="right">
                      Serial Number
                    </StyledTableCell>
                    <StyledTableCell>Date of Manufacture</StyledTableCell>
                    <StyledTableCell>Date Added</StyledTableCell>
                    {/* <StyledTableCell>Edit Product</StyledTableCell> */}
                    {/* <StyledTableCell>Delete Product</StyledTableCell> */}
                    <StyledTableCell>QR</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <StyledTableRow key={product.productId}>
                      <StyledTableCell component="th" scope="product">
                        {product.productId}
                      </StyledTableCell>
                      <StyledTableCell>{product.name}</StyledTableCell>
                      <StyledTableCell align="right">
                        {product.serialNumber}
                      </StyledTableCell>
                      <StyledTableCell>
                        {product.manufacturingDate}
                      </StyledTableCell>
                      <StyledTableCell>
                        {new Date(product.createdAt).toLocaleString("en-IN")}
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        <IconButton aria-label="delete" size="large">
                          <EditIcon />
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton aria-label="delete" size="large">
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell> */}
                      <StyledTableCell>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={() => generateQR(product.productId)}
                        >
                          <QrCode2 />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <canvas id="qrcode" style={{ visibility: "hidden" }}></canvas>
    </Container>
  );
}

export default SupplierManageProduct;
