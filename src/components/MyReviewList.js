import React, { useState, useEffect, useRef } from "react";

import ReviewService from "../services/review.service";
import AuthService from "../services/auth.service";

import review_image from "../images/review_image_2.jpg";

import jwt_decode from "jwt-decode";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Spinner from "react-bootstrap/Spinner";

const MyReviewList = () => {
  const theme = ["", "Action", "Fantasy", "Comedy"];

  const [content, setContent] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentReview, setCurrentReview] = useState({});

  const [image, setImage] = useState();
  const [title, setTitle] = useState();
  const [selectedTheme, setSelectedTheme] = useState();
  const [description, setDescription] = useState();
  const [reviewText, setReviewText] = useState();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [postImage, setPostImage] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);

  const handleCloseAdd = () => {
    resetReviewInfo();
    setShowAdd(false);
  };

  const handleShowAdd = () => setShowAdd(true);
  const handleSubmitAdd = async () => {
    await ReviewService.createReview(
      title,
      currentUser,
      description,
      reviewText,
      selectedTheme,
      postImage
    );
    setShowAdd(false);
    window.location.reload();
  };

  const handleCloseEdit = () => {
    resetReviewInfo();
    setShowEdit(false);
  };
  const handleShowEdit = () => setShowEdit(true);
  const handleSubmitEdit = async () => {
    await ReviewService.updateReviewInfo(
      currentReview.id,
      title,
      description,
      reviewText,
      selectedTheme,
      postImage
    );
    setShowEdit(false);
    window.location.reload();
  };

  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => {
    resetReviewInfo();
    setShowDelete(false);
  };

  const handleSubmitDelete = async () => {
    await ReviewService.deleteReviewById(currentReview.id);
    setShowDelete(false);
    window.location.reload();
  };

  const resetReviewInfo = () => {
    setCurrentReview({});
    setTitle("");
    setSelectedTheme("");
    setDescription("");
    setReviewText("");
    setPostImage("");
    setImage(review_image);
  };

  useEffect(() => {
    setShowSpinner(true);
    const token = AuthService.getCurrentUser();

    if (token) {
      let tokenInfo = jwt_decode(token);
      let tokenString = JSON.stringify(tokenInfo);

      let user = JSON.parse(tokenString);

      setCurrentUser(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );

      setImage(review_image);

      ReviewService.getUserContentByEmail(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      ).then(
        (response) => {
          setContent((old) => [...old, ...response.data]);
          setShowSpinner(false);
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          setContent(_content);
          setShowSpinner(false);
        }
      );
    }
  }, []);

  const editReview = (i) => {
    const review = content[i];
    setCurrentReview(review);

    setTitle(content[i].title);
    setSelectedTheme(content[i].theme);
    setDescription(content[i].description);
    setReviewText(content[i].reviewText);

    if (content[i].image === "" || content[i].image === null) {
      setImage(review_image);
      setPostImage("");
    } else {
      setImage(content[i].image);
      setPostImage(content[i].image);
    }

    handleShowEdit();
  };

  const deleteReview = (i) => {
    const review = content[i];
    setCurrentReview(review);
    handleShowDelete();
  };

  const addReview = () => {
    setPostImage("");
    handleShowAdd();
  };

  const fileRef = useRef();

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      console.log(event.target.files[0]);

      const base64 = await convertToBase64(event.target.files[0]);
      setPostImage(base64);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSelect = (e) => {
    setSelectedTheme(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleReviewText = (e) => {
    setReviewText(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const setDefaultImage = (i) => {
    if (content[i].image !== "" && content[i].image !== null) {
      return content[i].image;
    } else {
      return review_image;
    }
  };

  const setRating = (e) => {
    if (e.rating !== "" && e.rating !== null) {
      let ratingValue = e.rating;
      return ratingValue.toFixed(1);
    }
    return "no rating";
  };

  return (
    <>
      {showSpinner === false ? (
        <div className="container">
          <header className="jumbotron">
            <br></br>
            <div className="review-add-item">
              <button
                type="submit"
                onClick={() => addReview()}
                className="btn btn-primary mr-1"
              >
                Add New Review
              </button>
            </div>
            <hr></hr>
            <div className="review-container">
              {content.map((e, i) => (
                <div className="review-box-group" key={i}>
                  <div className="review-box">
                    <div className="review-image">
                      <img
                        src={setDefaultImage(i)}
                        alt=""
                        className="review-image-img"
                      ></img>
                    </div>

                    <div className="review-content">
                      <div className="review-title">
                        <a
                          href={"review/" + e.id}
                          className="review-title-href"
                        >
                          <h5>{e.title} </h5>
                        </a>
                      </div>
                      <div className="review-theme">
                        <h6>{e.theme} </h6>
                      </div>
                      <div className="review-description">
                        <p>{e.description}</p>
                      </div>
                      <div className="review-rank">
                        <div className="review-likes">
                          <div className="review-likes-image"></div>
                          <div className="review-likes-text">
                            {e.likesCount}
                          </div>
                        </div>

                        <div className="review-rating">
                          <div className="review-rating-image"></div>
                          <div className="review-rating-text">
                            {setRating(e)}
                          </div>
                        </div>
                      </div>
                      <div className="review-nickname">
                        <span>Author: {e.nickname} </span>
                      </div>
                    </div>

                    <div className="review-buttons">
                      <button
                        type="submit"
                        onClick={() => editReview(i)}
                        className="btn btn-primary mr-1"
                      >
                        Edit
                      </button>
                      <button
                        type="submit"
                        onClick={() => deleteReview(i)}
                        className="btn btn-secondary mr-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              ))}
            </div>
          </header>
        </div>
      ) : (
        <div className="spinner">
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading . . . </span>
        </div>
      )}

      <Modal
        show={showAdd}
        onHide={handleCloseAdd}
        className="modal-xl modal-dialog-centered modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="review-editor-body">
            <div className="review-editor-image">
              <div className="review-editor-image-img">
                <img src={image} alt=""></img>
              </div>
              <div className="review-editor-image-btn">
                <Button
                  variant="primary"
                  onClick={() => fileRef.current.click()}
                >
                  File Input Button
                </Button>
                <input
                  ref={fileRef}
                  onChange={handleImageChange}
                  multiple={false}
                  type="file"
                  hidden
                />
              </div>
            </div>
            <div className="review-editor-content">
              <div className="review-editor-title">
                <label>Title</label>
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  onChange={handleTitle}
                />
              </div>
              <div className="review-editor-theme">
                <label>Theme</label>
                <div className="dropdown">
                  <select
                    className="form-select"
                    aria-label="Default select"
                    onChange={handleSelect}
                  >
                    {theme.map((e, i) => (
                      <option key={i} value={theme[i]}>
                        {theme[i]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="review-editor-description">
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  className="form-control"
                  onChange={handleDescription}
                />
              </div>
              <div className="review-editor-text">
                <label>Review text</label>
                <textarea
                  name="reviewText"
                  className="form-control review-editor-area"
                  onChange={handleReviewText}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmitAdd}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        className="modal-xl modal-dialog-centered modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title>Review editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="review-editor-body">
            <div className="review-editor-image">
              <div className="review-editor-image-img">
                <img src={image} alt=""></img>
              </div>
              <div className="review-editor-image-btn">
                <Button
                  variant="primary"
                  onClick={() => fileRef.current.click()}
                >
                  File Input Button
                </Button>
                <input
                  ref={fileRef}
                  onChange={handleImageChange}
                  multiple={false}
                  type="file"
                  hidden
                />
              </div>
            </div>
            <div className="review-editor-content">
              <div className="review-editor-title">
                <label>Title</label>
                <input
                  name="title"
                  type="text"
                  defaultValue={currentReview.title}
                  className="form-control"
                  onChange={handleTitle}
                />
              </div>
              <div className="review-editor-theme">
                <label>Theme</label>
                <div className="dropdown">
                  <select
                    className="form-select"
                    defaultValue={currentReview.theme}
                    aria-label="Default select"
                    onChange={handleSelect}
                  >
                    {theme.map((e, i) => (
                      <option key={i} value={theme[i]}>
                        {theme[i]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="review-editor-description">
                <label>Description</label>
                <input
                  name="description"
                  type="text"
                  defaultValue={currentReview.description}
                  className="form-control"
                  onChange={handleDescription}
                />
              </div>
              <div className="review-editor-text">
                <label>Review text</label>
                <textarea
                  name="reviewText"
                  defaultValue={currentReview.reviewText}
                  className="form-control review-editor-area"
                  onChange={handleReviewText}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmitEdit}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmitDelete}>
            Ok
          </Button>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyReviewList;
