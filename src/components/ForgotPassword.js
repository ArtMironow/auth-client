import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

import Spinner from "react-bootstrap/Spinner";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ForgotPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);

  function onSubmit(data) {
    setShowSpinner(true);
    AuthService.forgotpassword(data.email).then(
      () => {
        console.log("Check your email");
        setResponseTitle("Success");
        setResponseMessage("Check your email!");
        setShowSpinner(false);
        handleShow();
      },
      (error) => {
        setResponseTitle(error.response.data.errors);
        setResponseMessage("Email is incorrect");
        setShowSpinner(false);
        handleShow();
      }
    );
  }

  return (
    <>
      {showSpinner === false ? (
        <div className="carditem">
          <h5>Forgot Password</h5>
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

export default ForgotPassword;
