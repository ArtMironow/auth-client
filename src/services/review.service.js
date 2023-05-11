import axios from "axios";
import authHeader from "./auth-header";

const REVIEW_URL =
  "https://irzh7zwl0a.execute-api.eu-north-1.amazonaws.com/api/review";

const getPublicContent = async () => {
  const response = await axios.get(REVIEW_URL + "/getall");
  return response.data;
};

const getReviewById = async (id) => {
  try {
    const response = await axios.get(REVIEW_URL + `/getreview/${id}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (err) {
    return null;
  }
};

const getUserContentByEmail = async (email) => {
  const response = await axios.get(REVIEW_URL + `/getbyemail/${email}`, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteReviewById = async (id) => {
  const response = await axios.delete(REVIEW_URL + `/deletereview/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

const updateReviewInfo = async (
  id,
  title,
  description,
  reviewText,
  theme,
  image
) => {
  const response = await axios.post(
    REVIEW_URL + `/updatereview`,
    {
      Id: id,
      Title: title,
      Description: description,
      ReviewText: reviewText,
      Theme: theme,
      Image: image,
    },
    { headers: authHeader() }
  );
  return response.data;
};

const createReview = async (
  title,
  email,
  description,
  reviewText,
  theme,
  image
) => {
  const response = await axios.post(
    REVIEW_URL + `/createreview`,
    {
      Title: title,
      Email: email,
      Description: description,
      ReviewText: reviewText,
      Theme: theme,
      Image: image,
    },
    { headers: authHeader() }
  );
  return response.data;
};

const ReviewService = {
  getPublicContent,
  getUserContentByEmail,
  deleteReviewById,
  updateReviewInfo,
  createReview,
  getReviewById,
};

export default ReviewService;
