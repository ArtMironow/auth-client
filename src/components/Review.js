import React, { useEffect, useState } from "react";

import ReviewService from "../services/review.service";

import ReviewContent from "./ReviewContent";
import NotFound from "./NotFound";

import { useParams } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";

const Review = () => {
  const [content, setContent] = useState("");
  const { id } = useParams();

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(true);
    const fetchData = async () => {
      const response = await ReviewService.getReviewById(id);
      setContent(response);
      setShowSpinner(false);
    };
    fetchData();
  }, [id]);

  return (
    <>
      {showSpinner === false ? (
        <>
          {content ? (
            <div>
              <ReviewContent />
            </div>
          ) : (
            <div>
              <NotFound />
            </div>
          )}
        </>
      ) : (
        <div className="spinner">
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading . . . </span>
        </div>
      )}
    </>
  );
};

export default Review;
