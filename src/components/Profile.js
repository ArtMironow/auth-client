import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import jwt_decode from "jwt-decode";

const Profile = () => {
  const [checked, setChecked] = React.useState(false);
  const validationSchema = Yup.object().shape({
    cbx: Yup.boolean(),
    oldpassword: Yup.string()
      .required("Password is required")
      .min(7, "Password must be at least 6 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(7, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleChange = () => {
    setChecked(!checked);
  };

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const token = AuthService.getCurrentUser();
    let tokenInfo = jwt_decode(token);
    let tokenString = JSON.stringify(tokenInfo);

    let user = JSON.parse(tokenString);
    let userEmail =
      user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    AuthService.getAccountInfo(userEmail).then((response) => {
      setEmail(response.data.Email);
      setNickname(response.data.Nickname);
    });
  }, []);

  function onSubmitNickname(event) {
    event.preventDefault();
    const nicknameToUpdate = event.target.elements.nickname.value;
    AuthService.updateAccountInfo(
      nicknameToUpdate,
      email,
      null,
      null,
      null
    ).then(
      (response) => {
        localStorage.setItem("token", JSON.stringify(response.data));

        setResponseTitle("Success");
        setResponseMessage("Your Nickname was successfully changed");
        handleShow();
      },
      (error) => {
        setResponseTitle("Error");
        setResponseMessage("Something went wrong :(");
        handleShow();
      }
    );
  }

  function onSubmit(data) {
    AuthService.updateAccountInfo(
      nickname,
      email,
      data.oldpassword,
      data.password,
      data.confirmPassword
    ).then(
      (response) => {
        localStorage.setItem("token", JSON.stringify(response.data));

        setResponseTitle("Success");
        setResponseMessage("Your Password was successfully changed");
        handleShow();
        reset();
      },
      (error) => {
        setResponseTitle("Error");
        setResponseMessage("Something went wrong :(");
        handleShow();
      }
    );
  }

  return (
    <div className="carditem">
      <h5>Settings</h5>
      <div className="card-body">
        <form onSubmit={onSubmitNickname}>
          <div className="form-group col">
            <div>
              <label>Email</label>
              <input
                name="email"
                type="text"
                readOnly
                placeholder={email}
                className="form-control"
              />
            </div>
            <label>Nickname</label>
            <input
              name="nickname"
              type="text"
              defaultValue={nickname}
              className="form-control"
            />
          </div>
          <div className="form-group group">
            <button type="submit" className="btn btn-primary mr-1">
              Save
            </button>
          </div>
        </form>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col">
              <label>
                <input
                  type="checkbox"
                  name="cbx"
                  checked={checked}
                  onChange={handleChange}
                />
                &nbsp; Password changes
              </label>
            </div>

            {checked === true ? (
              <div>
                <div className="form-group col">
                  <label>Old Password</label>
                  <input
                    name="oldpassword"
                    type="password"
                    {...register("oldpassword")}
                    className={`form-control ${
                      errors.oldpassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.oldpassword?.message}
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
            ) : (
              ""
            )}
          </div>

          <div className="form-group group">
            <button type="submit" className="btn btn-primary mr-1">
              Save
            </button>
          </div>
        </form>
      </div>
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
    </div>
  );
};

export default Profile;
