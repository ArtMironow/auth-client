import axios from "axios";
import authHeader from "./auth-header";

const RATING_URL =
  "https://irzh7zwl0a.execute-api.eu-north-1.amazonaws.com/api/ratings";

const addRating = async (value, email, reviewId) => {
  const response = await axios.post(
    RATING_URL + `/createrating`,
    {
      Value: value,
      Email: email,
      ReviewId: reviewId,
    },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

const updateRating = async (id, value) => {
  const response = await axios.post(
    RATING_URL + "/updaterating",
    {
      Id: id,
      Value: value,
    },
    { headers: authHeader() }
  );
  return response.data;
};

const getRatingByReviewId = async (id) => {
  const response = await axios.get(RATING_URL + `/getreviewsrating/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

const removeRating = async (id) => {
  const response = await axios.delete(RATING_URL + `/deleterating/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

const getRatingByEmailAndReviewId = async (email, reviewId) => {
  const response = await axios.post(
    RATING_URL + "/getratingbyemailandreviewid",
    {
      Email: email,
      ReviewId: reviewId,
    },
    { headers: authHeader() }
  );
  return response.data;
};

const RatingService = {
  addRating,
  updateRating,
  getRatingByReviewId,
  removeRating,
  getRatingByEmailAndReviewId,
};

export default RatingService;
