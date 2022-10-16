import { Container, Grid, Paper, Typography } from "@mui/material";
import jwtDecode from "jwt-decode";
import * as React from "react";
import { UserContext } from "../../contexts/UserContext";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import QrCode2 from "@mui/icons-material/QrCode2";
import { ProductContext } from "../../contexts/ProductContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

function SupplierHome() {
  const [user, setUser] = React.useContext(UserContext);
  const [products, setProducts] = React.useContext(ProductContext);
  const [fakeProducts, setFakeProducts] = React.useState([]);
  const [fakeProductsCount, setFakeProductsCount] = React.useState(0);

  let totalProducts = products.length;
  let totalShipped = 0;

  products.forEach((product) => {
    const shipped = product.ownerships.find((owner) => {
      return owner.owner._id === user.id && owner.sent !== null;
    });

    if (shipped) {
      totalShipped++;
    }
  });

  let toBeShipped = totalProducts - totalShipped;

  React.useEffect(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const res = await fetch("http://localhost:8000/api/product/getfake", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
    });

    const data = await res.json();

    const fakeProducts = data.products;

    setFakeProducts(fakeProducts);
    setFakeProductsCount(fakeProducts.length);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 120,
              backgroundColor: "#f44336",
              color: "#fff",
            }}
            elevation={3}
          >
            <h2>Total Products</h2>
            <Typography component="p" variant="h4">
              {totalProducts}
            </Typography>
            <Typography sx={{ flex: 1 }}>
              on {new Date().toLocaleString("en-IN")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 120,
              backgroundColor: "#ffc107",
            }}
            elevation={3}
          >
            <h2>Total Shipped</h2>
            <Typography component="p" variant="h4">
              {totalShipped}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              on {new Date().toLocaleString("en-IN")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 120,
              backgroundColor: "#3f51b5",
              color: "#fff",
            }}
            elevation={3}
          >
            <h2>To be shipped</h2>
            <Typography component="p" variant="h4">
              {totalProducts - totalShipped}
            </Typography>
            <Typography sx={{ flex: 1 }}>
              on {new Date().toLocaleString("en-IN")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 120,
              backgroundColor: "#00c853",
            }}
            elevation={3}
          >
            <h2>Fake Products</h2>
            <Typography component="p" variant="h4">
              {fakeProductsCount}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              on {new Date().toLocaleString("en-IN")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sx={{ width: "100%", mt: 2 }}>
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
              Fake Products
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
                    <StyledTableCell>Last Scanned By</StyledTableCell>
                    <StyledTableCell>Time</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fakeProducts.map((product) => (
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
                        {`${product.lastScannedBy.name} / ${product.lastScannedBy.role}`}
                      </StyledTableCell>
                      <StyledTableCell>
                        {new Date(
                          product.lastScannedBy.createdAt
                        ).toLocaleString("en-IN")}
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

export default SupplierHome;
