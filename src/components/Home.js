import React, { useState, useEffect } from "react";

import ReviewService from "../services/review.service";
import AuthService from "../services/auth.service";

import review_image from "../images/review_image_2.jpg";

import Spinner from "react-bootstrap/Spinner";

const Home = () => {
  const [content, setContent] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(true);
    ReviewService.getPublicContent().then(
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
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

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
            <div className="review-container">
              {content.map((e, i) => (
                <div key={i}>
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
                        {currentUser ? (
                          <a
                            href={"review/" + e.id}
                            className="review-title-href"
                          >
                            <h5>{e.title} </h5>
                          </a>
                        ) : (
                          <h5>{e.title} </h5>
                        )}
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
    </>
  );
};

export default Home;
