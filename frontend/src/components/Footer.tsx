import {
  makeStyles,
  Container,
  Box,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import React from "react";
// import { Link } from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Kim-Change-The-World-2023
      </Link>
    </Typography>
  );
}

export default function Footer() {
  const content = {
    brand: { image: "nereus-assets/img/nereus-light.png", width: 110 },
    copy: "© 2020 Nereus All rights reserved.",
    link1: "First Link",
    link2: "Second Link",
    link3: "Third Link",
    link4: "Fourth Link",
  };

  let brand;

  // if (content.brand.image) {
  //   brand = (
  //     <img src={content.brand.image} alt="" width={content.brand.width} />
  //   );
  // } else {
  //   brand = content.brand.text || "";
  // }

  return (
    <footer>
      <Box
        sx={{
          width: "100%",
          // height: "auto",
          // backgroundColor: "primary.main",
          // paddingTop: "1rem",
          // paddingBottom: "1rem",
          position: "fixed",
          bottom: 0,
        }}
      >
        <Container maxWidth="lg">
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12} padding={2}>
              <Typography color="textSecondary" variant="subtitle1">
                <Copyright />
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
}
