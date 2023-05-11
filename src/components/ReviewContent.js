import React, { useEffect, useState } from "react";

import ReviewService from "../services/review.service";
import LikeService from "../services/like.service";
import RatingService from "../services/rating.service";
import AuthService from "../services/auth.service";

import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

import review_image from "../images/review_image_2.jpg";

const ReviewContent = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [content, setContent] = useState({});
  const { id } = useParams();

  const [userRating, setUserRating] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [like, setLike] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCounter, setLikeCounter] = useState("");

  const [rating, setRating] = useState(0);

  const [hover, setHover] = useState(0);

  useEffect(() => {
    const token = AuthService.getCurrentUser();

    const fetchData = async () => {
      const response = await ReviewService.getReviewById(id);
      setContent(response.data);
    };

    const fetchLike = async (email) => {
      const response = await LikeService.getLike(email, id);
      if (response.data !== "") {
        setLiked(true);
      }
      setLike(response.data);
    };

    const getRatingByEmailAndReviewId = async (email) => {
      const response = await RatingService.getRatingByEmailAndReviewId(
        email,
        id
      );
      if (response.data !== "") {
        setUserRating(response.data);
        setRating(response.data.value);
      }
    };

    if (token) {
      let tokenInfo = jwt_decode(token);
      let tokenString = JSON.stringify(tokenInfo);
      let user = JSON.parse(tokenString);

      setCurrentUser(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );

      fetchData();
      fetchLike(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
      getRatingByEmailAndReviewId(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
    }
  }, [id]);

  useEffect(() => {
    const GetAllLikes = async () => {
      const response = await LikeService.getLikeCountByReviewId(id);
      setLikeCounter(response.data);
    };

    GetAllLikes();
  }, [id, liked]);

  useEffect(() => {
    const fetchRating = async () => {
      const response = await RatingService.getRatingByReviewId(id);
      if (response.data !== "" && response.data !== null) {
        let ratingValue = response.data.toFixed(1);
        setReviewRating(ratingValue);
      } else {
        setReviewRating(0);
      }
    };

    fetchRating();
  }, [id, rating]);

  const setDefaultImage = () => {
    if (content.image !== "" && content.image !== null) {
      return content.image;
    } else {
      return review_image;
    }
  };

  const setGeneralRating = () => {
    if (reviewRating === "" || reviewRating === null) {
      return "0";
    } else {
      return reviewRating;
    }
  };

  const handleToggle = async () => {
    if (liked === true) {
      await LikeService.removeLike(like.id);
      setLiked(false);
    } else {
      const response = await LikeService.addLike(currentUser, content.id);
      setLike(response.data);
      setLiked(true);
    }
  };

  const handleRating = async (i) => {
    if (i === rating) {
      return;
    }

    if (userRating === "" || userRating === null) {
      const response = await RatingService.addRating(i, currentUser, id);
      setUserRating(response.data);
    } else {
      const response = await RatingService.updateRating(userRating.id, i);
      setUserRating(response.data);
    }

    setRating(i);
  };

  const handleDeleteRating = async () => {
    await RatingService.removeRating(userRating.id);
    setUserRating("");
    setRating(0);
    setHover(0);
  };

  return (
    <>
      {currentUser ? (
        <div className="review-content-container">
          <div className="review-image-and-description-container">
            <div className="review-image-container">
              <img
                src={setDefaultImage()}
                alt=""
                className="review-photo"
              ></img>
            </div>
            <div className="review-global-description">
              <div>
                <div className="review-page-title">
                  <h4>
                    <b>{content.title}</b>
                  </h4>
                </div>
                <hr></hr>
                <div className="review-page-theme">
                  <h5>{content.theme}</h5>
                </div>

                <div className="review-page-description">
                  <p>{content.description}</p>
                </div>
              </div>

              <div className="review-page-author">
                <h5>Author:&nbsp; {content.nickname}</h5>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="review-page-text-container">
            <div className="review-page-text">
              <p>{content.reviewText}</p>
            </div>
          </div>
          <hr></hr>
          <div className="review-rating-and-likes-container">
            <div className="user-rating">
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={index <= (hover || rating) ? "on" : "off"}
                      onClick={() => handleRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(rating)}
                      onDoubleClick={() => handleDeleteRating()}
                    >
                      <span className="star">&#9733;</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="user-rating">
              <b>Your rating:&nbsp; {rating}</b>
            </div>
            <div className="general-review-rating">
              <b>Review rating:&nbsp; {setGeneralRating()}/5</b>
            </div>
            <div className="review-likes">
              <div className="review-likes-button">
                <i
                  onClick={handleToggle}
                  className={
                    liked ? "fa fa-thumbs-up fa-liked" : "fa fa-thumbs-up"
                  }
                ></i>
              </div>
              <div className="review-likes-counter">{likeCounter}</div>
            </div>
          </div>
          <hr></hr>
          <div className="review-comments-container">
            <div className="review-comments"></div>
          </div>
        </div>
      ) : (
        <div className="review-page-text">
          <h3>You should be authorized to see this page.</h3>
        </div>
      )}
    </>
  );
};

export default ReviewContent;
