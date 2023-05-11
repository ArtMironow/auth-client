import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Spinner from "react-bootstrap/Spinner";

const ResetPassword = () => {
  const validationSchema = Yup.object().shape({
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

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    console.log("Reset password");

    setEmail(searchParams.get("email"));
    setToken(searchParams.get("token"));
  }, [searchParams]);

  function onSubmit(data) {
    setShowSpinner(true);
    AuthService.resetpassword(
      data.password,
      data.confirmPassword,
      email,
      token
    ).then(
      () => {
        console.log("Login with new password");
        setResponseTitle("Success");
        setResponseMessage("Password was successfully changed");
        setShowSpinner(false);
        handleShow();
      },
      (error) => {
        setResponseTitle(error.response.data.errors);
        setResponseMessage("Internal server error");
        setShowSpinner(false);
        handleShow();
      }
    );
  }

  return (
    <>
      {showSpinner === false ? (
        <div className="carditem">
          <h5>Reset Password</h5>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
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
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="spinner">
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading . . . </span>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{responseTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{responseMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResetPassword;
