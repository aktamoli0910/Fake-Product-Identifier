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
import { QrReader } from "react-qr-reader";
import LocalShipping from "@mui/icons-material/LocalShipping";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import "./style.css";
import { ProductContext } from "../../contexts/ProductContext";
import { UserContext } from "../../contexts/UserContext";

function ScanProduct() {
  const [successAlert, setSuccessAlert] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState("");

  const [user, setUser] = React.useContext(UserContext);

  const [productId, setProductId] = React.useState("");
  const [product, setProduct] = React.useState(null);
  const [genuine, setGenuine] = React.useState(null);

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
        setProduct(data.product);
        setTimeout(() => setSuccessAlert(""), 2000);
      } else {
        setErrorAlert(data.error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(async () => {
    try {
      setSuccessAlert("");
      setErrorAlert("");

      const res = await fetch(
        `http://localhost:8000/api/product/get/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        if (data.product) {
          setSuccessAlert("Product scanned successfully");
          setTimeout(() => setSuccessAlert(""), 2000);
        }
        setProduct(data.product);
        setGenuine(data.genuine);
      } else {
        setErrorAlert(data.error.message);
      }
    } catch (err) {
      console.log(err);
    }
  }, [productId]);

  let pid = 0;
  let productName = "";
  let serialNumber = 0;
  let manufacturingDate = "//";

  if (product) {
    pid = product._id;
    productName = product.name;
    serialNumber = product.serialNumber;
    manufacturingDate = product.manufacturingDate;
  }

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
              height: "520px",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Scan Products
            </Typography>
            <QrReader
              delay={5000}
              onResult={(result, error) => {
                if (!!result) {
                  setProductId(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              height: "520px",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Product Details
            </Typography>
            <Container
              style={{
                height: "100%",
              }}
            >
              {product && genuine && (
                <Alert sx={{ mt: 2, mb: 2 }} severity="success">
                  The product is genuine.
                </Alert>
              )}
              {product && !genuine && (
                <Alert sx={{ mt: 2, mb: 2 }} severity="warning">
                  The product may be a counterfeit.
                </Alert>
              )}
              <div class="product-details">
                <div class="product-info">
                  <p>
                    <b>Product ID: </b>
                    {pid}
                  </p>
                  <p>
                    <b>Product Name: </b>
                    {productName}
                  </p>
                  <p>
                    <b>Serial Number: </b>
                    {serialNumber}
                  </p>
                  <p>
                    <b>Manufacturing Date: </b>
                    {manufacturingDate}
                  </p>
                </div>
                <div class="product-status">
                  {product && genuine && (
                    <img src="https://cdn-icons-png.flaticon.com/512/3699/3699516.png"></img>
                  )}
                  {product && !genuine && (
                    <img src="https://cdn-icons-png.flaticon.com/512/1672/1672451.png"></img>
                  )}
                </div>
              </div>
              <div id="timeline">
                <h2>Timeline</h2>

                {product &&
                  product.ownerships.map((owner) => {
                    return (
                      <div className="timeline-item">
                        <p>
                          <b>
                            {owner.owner.role === "manufacturer"
                              ? "Manufactured"
                              : "Received"}{" "}
                            by{" "}
                          </b>
                          {owner.owner.name} / {owner.owner.role}
                          <b> at </b>
                          {new Date(owner.received).toLocaleString("en-IN")}
                        </p>
                        <p>
                          <b>Sent </b>
                          <b> at </b>
                          {owner.sent
                            ? new Date(owner.sent).toLocaleString("en-IN")
                            : "Not sent"}
                        </p>
                        <p>
                          <b>Location </b>
                          {owner.owner.address}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Container>
            <Button
              variant="contained"
              endIcon={<LocalShippingIcon />}
              onClick={() => handleSubmit(productId)}
            >
              {user && user.role === "consumer" && "Register Product"}
              {user && user.role !== "consumer" && "Ship Product"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ScanProduct;
