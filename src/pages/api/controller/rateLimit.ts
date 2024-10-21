import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de requête, veuillez réessayer plus tard.",
});

const apiConfig = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
  limiter,
};

export default apiConfig;