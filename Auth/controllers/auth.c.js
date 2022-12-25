const bcrypt = require("bcrypt");

const userModel = require("../models/user.m");

const { generateToken, verifyToken } = require("../helpers/token.helper");

exports.register = async (req, res) => {
  const { username, password, fullname, address } = req.body;
  const user = await userModel.getByUsername(username?.toLowerCase());

  if (user) res.status(409).send("Tên tài khoản đã tồn tại.");
  else {
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDS),
    );
    const newUser = {
      username: username?.toLowerCase(),
      password: hashPassword,
      fullname,
      address,
    };
    const createUser = await userModel.add(newUser);
    if (!createUser) {
      return res
        .status(400)
        .send("Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.");
    }

    return res.json(createUser);
  }
};

exports.login = async (req, res) => {
  const { username, password, tokenLife } = req.body;

  const user = await userModel.getByUsername({
    username: username?.toLowerCase(),
  });
  if (!user) {
    return res.status(401).send("Tên đăng nhập không tồn tại.");
  }

  const isPasswordValid = bcrypt.compareSync(password, user.Password);
  if (!isPasswordValid) {
    return res.status(401).send("Mật khẩu không chính xác.");
  }

  const refreshTokenLife = tokenLife;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const dataForAccessToken = {
    userID: user.UserID,
  };
  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    process.env.ACCESS_TOKEN_LIFE,
  );
  if (!accessToken) {
    return res
      .status(401)
      .send("Đăng nhập không thành công, vui lòng thử lại.");
  }

  const refreshToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    refreshTokenLife || process.env.ACCESS_TOKEN_LIFE,
  );
  await userModel.updateToken({ userID: user.UserID, refreshToken });

  return res.json({
    msg: "Đăng nhập thành công.",
    accessToken,
    refreshToken,
    user,
  });
};

exports.refreshToken = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send("Không tìm thấy access token.");
  }

  // Lấy refresh token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send("Không tìm thấy refresh token.");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

  // Decode access token đó
  const verifyAccessToken = await verifyToken(
    accessTokenFromHeader,
    accessTokenSecret,
  );
  if (!verifyAccessToken) {
    return res.status(400).send("Access token không hợp lệ.");
  }

  const userID = verifyAccessToken.payload.userID; // Lấy userID từ payload
  const user = await userModel.getByID({ id: userID });
  if (!user) {
    return res.status(401).send("User không tồn tại.");
  }

  const verifyRefreshToken = verifyToken(
    refreshTokenFromBody,
    accessTokenSecret,
  );
  if (!verifyRefreshToken) {
    return res.status(400).send("Refresh token không hợp lệ.");
  }

  // Tạo access token mới
  const dataForAccessToken = {
    userID,
  };

  const accessToken = await generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife,
  );
  if (!accessToken) {
    return res
      .status(400)
      .send("Tạo access token không thành công, vui lòng thử lại.");
  }
  return res.json({
    accessToken,
  });
};
