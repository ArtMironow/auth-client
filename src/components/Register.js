import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

import Spinner from "react-bootstrap/Spinner";

const Register = () => {
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(7, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [responseErrors, setResponseErrors] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSpinner, setShowSpinner] = useState(false);

  function onSubmit(data) {
    setShowSpinner(true);

    AuthService.register(data.email, data.password, data.confirmPassword).then(
      (response) => {
        setShowSpinner(false);
        navigate("/login");
        window.location.reload();
      },
      (error) => {
        setShowSpinner(false);
        setResponseErrors(error.response.data.errors[1]);
        handleShow();
      }
    );
  }

  const responseMessage = (response) => {
    setShowSpinner(true);
    AuthService.externalLogin("GOOGLE", response.credential).then(
      (response) => {
        localStorage.setItem("token", JSON.stringify(response.data));
        setShowSpinner(false);
        navigate("/");
        window.location.reload();
      }
    );
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const responseFacebook = (response) => {
    setShowSpinner(true);
    AuthService.externalLogin("FACEBOOK", response.accessToken).then(
      (response) => {
        localStorage.setItem("token", JSON.stringify(response.data));
        setShowSpinner(false);
        navigate("/");
        window.location.reload();
      }
    );
  };

  return (
    <>
      {showSpinner === false ? (
        <div className="carditem">
          <h5>Registration</h5>
          <div>
            <div className="socialLogin">
              <div>
                <GoogleLogin
                  onSuccess={responseMessage}
                  onError={errorMessage}
                  className="socialLoginGoogle"
                />
              </div>
              <div>
                <FacebookLogin
                  appId="970002050837376"
                  fields="name"
                  callback={responseFacebook}
                  cssClass="socialLoginFacebook"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="25"
                      fill="currentColor"
                      className="bi bi-facebook"
                      viewBox="0 0 17 17"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <div className="form-group col">
                  <label>Email</label>
                  <input
                    name="email"
                    type="text"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="form-group col">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    {...register("password")}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
                <div className="form-group col">
                  <label>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>
              </div>

              <div className="form-group group">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="btn btn-secondary"
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary mr-1">
                  Register
                </button>
              </div>
            </form>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{responseErrors}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Check your credentials</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div className="spinner">
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading . . . </span>
        </div>
      )}
    </>
  );
};

export default Register;
