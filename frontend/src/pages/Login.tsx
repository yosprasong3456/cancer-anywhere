import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector, login } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/store";
import { Popover } from "@mui/material";
import SwitchMode from "../components/SwitchMode";
import { sizing } from "@mui/system";
import { enqueueSnackbar } from "notistack";

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

type Props = {};

export default function Login({}: Props) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const authReducer = useSelector(authSelector);
  // const [username, setUsername] = useState(null);
  // const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataSet = {
      username: data.get("username"),
      password: data.get("password"),
    };
    const result = await dispatch(login(dataSet));
    if (login.fulfilled.match(result)) {
      // alert("Login successfully");
      enqueueSnackbar(`เข้าสู่ระบบสำเร็จ!`, {
        variant: "success",
      });
      navigate("/welcome");
    } else {
      enqueueSnackbar(`ผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง!`, {
        variant: "error",
      });
    }
  };

  React.useEffect(() => {
    if (authReducer.isAuthented) {
      navigate("/welcome");
    }
  }, []);

  return (
    <Grid
      container
      // component="main"
      sx={{ height: "100vh" }}
    >
      {/* <CssBaseline /> */}
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          // backgroundColor: (t) =>
          //   t.palette.mode === "light"
          //     ? t.palette.grey[50]
          //     : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Grid>
      <Grid item xs={12} sm={8} md={4} sx={{ margin: "auto" }}>
        <Box
          sx={{
            // my: 15,
            mx: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <img
                src="/udch.png"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  padding: 0,
                  margin: 0,
                }}
                alt="logo"
              />
            </Grid>
            <Grid item xs={8} sx={{ margin: "auto" }}>
              <Typography>ระบบบันทึกข้อมูลผู้ป่วยมะเร็ง</Typography>
              <Typography>เชื่อมต่อ Cancer Anywhere API</Typography>
            </Grid>
          </Grid>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="ชื่อผู้ใช้งาน"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  href="#"
                  variant="body2"
                >
                  ลืมรหัสผ่าน
                </Link>
              </Grid>
            </Grid>
            <SwitchMode />
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 2 }}>ติดต่อศูนย์คอมฯ 2713, 2714</Typography>
        </Popover>
      </Grid>
    </Grid>
  );
}
