import axios from "axios";
import authHeader from "./auth-header";

const LIKE_URL =
  "https://irzh7zwl0a.execute-api.eu-north-1.amazonaws.com/api/likes";

const addLike = async (email, reviewId) => {
  const response = await axios.post(
    LIKE_URL + `/createlike`,
    {
      Email: email,
      ReviewId: reviewId,
    },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

const removeLike = async (id) => {
  const response = await axios.delete(LIKE_URL + `/deletelike/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

const getLike = async (email, reviewId) => {
  const response = await axios.post(
    LIKE_URL + "/isliked",
    {
      Email: email,
      ReviewId: reviewId,
    },
    {
      headers: authHeader(),
    }
  );
  return response.data;
};

const getLikeCountByReviewId = async (id) => {
  const response = await axios.get(LIKE_URL + `/getallreviewlikes/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};

const getAllUserLikes = async (email) => {
  const response = await axios.get(LIKE_URL + `/getalluserslikes/${email}`, {
    headers: authHeader(),
  });
  return response.data;
};

const LikeService = {
  addLike,
  removeLike,
  getLike,
  getLikeCountByReviewId,
  getAllUserLikes,
};

export default LikeService;
