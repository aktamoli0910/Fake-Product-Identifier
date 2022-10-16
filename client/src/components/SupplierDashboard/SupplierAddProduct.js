import * as React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PrintIcon from "@mui/icons-material/Print";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import qrcode from "qrcode";

import "./style.css";
import { ProductContext } from "../../contexts/ProductContext";

function SupplierAddProduct() {
  const [products, setProducts] = React.useContext(ProductContext);

  const [successAlert, setSuccessAlert] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState("");

  const [name, setName] = React.useState("");
  const [serialNumber, setSerialNumber] = React.useState(0);
  const [manufacturingDate, setManufacturingDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  let uuid = uuidv4();

  const generateQR = async () => {
    try {
      await qrcode.toCanvas(document.getElementById("qrcode"), uuid, {
        scale: 6,
      });
    } catch (err) {}
  };

  const handleSubmit = async () => {
    try {
      setSuccessAlert("");
      setErrorAlert("");

      const res = await fetch("http://localhost:8000/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: uuid,
          name,
          serialNumber,
          manufacturingDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessAlert(data.message);
        setProducts([...products, data.product]);
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
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "350px",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Add Products
            </Typography>
            <TextField
              id="outlined-read-only-input"
              label="ProductID"
              name="productID"
              defaultValue={uuid}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
              size="small"
              fullWidth
            />
            <TextField
              id="outlined-basic"
              label="Product Name"
              name="productName"
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Serial Number"
              name="serialNumber"
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            <TextField
              id="date"
              label="Manufacturing date"
              type="date"
              name="manufacturingDate"
              defaultValue={new Date().toISOString().split("T")[0]}
              sx={{ width: 220 }}
              style={{ width: "100%" }}
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) => setManufacturingDate(e.target.value)}
            />
            <Stack direction="row" mt={1} spacing={1}>
              <Button
                variant="contained"
                endIcon={<AddCircleOutlineIcon />}
                onClick={handleSubmit}
              >
                Add
              </Button>
              <Button
                variant="contained"
                endIcon={<QrCode2Icon />}
                onClick={() => generateQR()}
                color="secondary"
              >
                Generate QR
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              height: "350px",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              QR Code
            </Typography>
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <canvas id="qrcode"></canvas>
            </Container>
            <Button
              variant="contained"
              endIcon={<PrintIcon />}
              id="print"
              onClick={() => {
                window.print();
              }}
            >
              Print QR
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SupplierAddProduct;
