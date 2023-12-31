import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import UAuth, { UserInfo } from "@uauth/js";

import AuthWrapper from "../../components/AuthWrapper";
import Button from "../../components/buttons/Button";
import Input from "../../components/inputs/basic/Input";
import PasswordInput from "../../components/inputs/basic/Password";
import Preloader from "../../components/utilities/Preloader";
import {UserContext} from "../../context";
import client from "../../feathers";
import LoginIcon from "@mui/icons-material/Login";
import GlobalCustomButton from "../../components/buttons/CustomButton";

function Login() {
  const navigate = useNavigate();
  const {handleSubmit, control} = useForm();
  const {setUser} = useContext(UserContext);
  const [keepMeIn, setKeepMeIn] = useState(false);
  const [loaderTimer, setLoaderTimer] = useState(true);
  const [loading, setLoading] = useState(false);

  // const [udInfo, setUdInfo] 
	const [udUser, setUdUser] = useState<UserInfo>();
	const [uauth, setUAuth] = useState<UAuth>();

  useEffect(() => {
		const uauthLogin = new UAuth({
			clientID: "4c51f6e3-fd63-4cb0-b35e-5a3b9ff9c9aa",
			redirectUri: window.location.origin,
			// redirectUri: "http://localhost:3000",
			scope: "openid wallet"
		  });
		  setUAuth(uauthLogin);
	},[])

	const handleUD = async () => {
		if(!udUser){
			try {
				const authorization = await uauth.loginWithPopup();
				window.location.reload();
		
			  } catch (error) {
				console.error(error);
			  }
		} else {
			await uauth.logout();
			window.location.reload();
		}
		
	}

	useEffect(() => {
		if(uauth == undefined){
			return;
		}
		uauth.user()
		  .then((user) => {
			setUdUser(user)
		  })
		  .catch((e) => {
			console.log(e)
		  })
		  
	
	  }, [uauth])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    document.title = "Health Stack - Login";
    setTimeout(() => setLoaderTimer(false), 1500);
  }, []);

  const onSubmit = async data => {
    const {email, password} = data;
    setLoading(true);
    await client
      .authenticate({
        strategy: "local",
        email,
        password,
      })
      .then(res => {
        const user = {
          ...res.user,
          currentEmployee: {...res.user.employeeData[0]},
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setLoading(false);
        toast.success("You successfully logged in");

        navigate("/app");
      })
      .catch(err => {
        setLoading(false);
        toast.error(`Error loggin in User, probable network issues  ${err}`);
      });
  };

  return (
    <>
      {/*  {console.error('hello there')} */}
      {loaderTimer ? (
        <Preloader />
      ) : (
        <AuthWrapper paragraph="Login here as an organization">

<GlobalCustomButton 
              onClick={handleUD}
              loading={loading}
              sx={{
                width: "100%",
                height: "38px",
              }}
            >
              <LoginIcon
                fontSize="small"
                sx={{
                  marginRight: "5px",
                }}
              />
              {udUser ? udUser.sub : 'Login with Unstoppable'}
            </GlobalCustomButton>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ToastContainer theme="colored" />

            <Box mb={2}>
              <Controller
                name="email"
                control={control}
                render={({field: {ref: _re, ...field}}) => (
                  <Input {...field} type="email" label="Email" />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="password"
                control={control}
                render={({field: {ref: _re, ...field}}) => (
                  <PasswordInput {...field} />
                )}
              />
            </Box>

            <FormControl
              component="fieldset"
              sx={{width: "1r00%", mt: 1, mb: 1}}
            >
              <FormGroup>
                <FormControlLabel
                  label="Keep me Logged in"
                  control={
                    <Checkbox
                      name="keepMeIn"
                      onChange={(_, value) => setKeepMeIn(value)}
                    />
                  }
                />
              </FormGroup>
            </FormControl>

            <GlobalCustomButton
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              sx={{
                width: "100%",
                height: "38px",
              }}
            >
              <LoginIcon
                fontSize="small"
                sx={{
                  marginRight: "5px",
                }}
              />
              Login
            </GlobalCustomButton>
          </form>

          <Box
            sx={{
              display: "flex",
              height: "40px",
              boxShadow: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
            mt={2}
          >
            <p>
              Forgot password?{" "}
              <Link
                className="nav-link"
                style={{
                  padding: "0",
                  background: "transparent",
                  color: "blue",
                  margin: "0",
                }}
                to="/forgot-password"
              >
                Click here
              </Link>
            </p>
          </Box>

          <div className="bottom-center">
            <p>or continue with</p>
            <a href="#">
              <i className="bi bi-google" />
            </a>
            <a href="">
              <i className="bi bi-facebook" />
            </a>
            <a href="">
              <i className="bi bi-linkedin" />
            </a>

            <Box
              sx={{
                display: "flex",
                height: "40px",
                boxShadow: 3,
                alignItems: "center",
                justifyContent: "center",
              }}
              mt={2}
            >
              <p>
                Want to create organization?{" "}
                <Link
                  className="nav-link"
                  style={{
                    padding: "0",
                    background: "transparent",
                    color: "blue",
                    margin: "0",
                  }}
                  to="/signup"
                >
                  Click here
                </Link>
              </p>
            </Box>
          </div>
        </AuthWrapper>
      )}
    </>
  );
}

export default Login;
