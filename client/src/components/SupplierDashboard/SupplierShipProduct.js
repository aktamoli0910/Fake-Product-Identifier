import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Container, Grid, IconButton, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ProductContext } from "../../contexts/ProductContext";
import { UserContext } from "../../contexts/UserContext";

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

function SupplierShipProduct() {
  const [products, setProducts] = React.useContext(ProductContext);
  const [user, setUser] = React.useContext(UserContext);

  const [successAlert, setSuccessAlert] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState("");

  const handleSubmit = async (productId) => {
    try {
      setSuccessAlert("");
      setErrorAlert("");

      const res = await fetch("http://localhost:8000/api/product/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessAlert(data.message);

        let productsUpdated = products.filter(
          (product) => product.productId !== productId
        );

        setProducts([...productsUpdated, data.product]);
      } else {
        setErrorAlert(data.error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {errorAlert && (
        <Alert sx={{ mt: 2 }} severity="error">
          {errorAlert}
        </Alert>
      )}
      {successAlert && (
        <Alert sx={{ mt: 2 }} severity="success">
          {successAlert}
        </Alert>
      )}
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
              Ship Products
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
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Date of Shipping</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                    <StyledTableCell>Ship Product</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <StyledTableRow key={product.productId}>
                      <StyledTableCell component="th" scope="row">
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
                      <StyledTableCell>
                        {product.ownerships[product.ownerships.length - 1].sent
                          ? "Shipped"
                          : "In Warehouse"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {product.ownerships[product.ownerships.length - 1].sent
                          ? new Date(
                              product.ownerships[
                                product.ownerships.length - 1
                              ].sent
                            ).toLocaleString("en-IN")
                          : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {product.ownerships.length > 0 &&
                        product.ownerships[product.ownerships.length - 1]
                          .received
                          ? `${
                              product.ownerships[product.ownerships.length - 1]
                                .owner.role === "manufacturer"
                                ? "Manufactured"
                                : "Received"
                            } by ${
                              product.ownerships[product.ownerships.length - 1]
                                .owner.name
                            } / ${
                              product.ownerships[product.ownerships.length - 1]
                                .owner.role
                            } at ${new Date(
                              product.ownerships[
                                product.ownerships.length - 1
                              ].received
                            ).toLocaleString("en-IN")}`
                          : ""}
                        <br></br>
                        {product.ownerships.length > 0 &&
                        product.ownerships[product.ownerships.length - 1].sent
                          ? `Sent by ${
                              product.ownerships[product.ownerships.length - 1]
                                .owner.name
                            } / ${
                              product.ownerships[product.ownerships.length - 1]
                                .owner.role
                            } at ${new Date(
                              product.ownerships[
                                product.ownerships.length - 1
                              ].sent
                            ).toLocaleString("en-IN")}`
                          : ""}
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          size="large"
                          onClick={() => handleSubmit(product.productId)}
                        >
                          <LocalShippingIcon />
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
    </Container>
  );
}

export default SupplierShipProduct;
