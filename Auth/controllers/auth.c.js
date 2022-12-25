const bcrypt = require("bcrypt");

const userModel = require("../models/user.m");

const { generateToken, verifyToken } = require("../helpers/token.helper");

exports.register = async (req, res, next) => {
  try {
    const { username, password, fullname, address } = req.body;
    const user = await userModel.getByUsername({
      username: username?.toLowerCase(),
    });

    if (user) res.status(409).json({ msg: "Tên tài khoản đã tồn tại." });
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
        return res.status(400).json({
          msg: "Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.",
        });
      }

      return res.json(createUser);
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password, tokenLife } = req.body;

    const user = await userModel.getByUsername({
      username: username?.toLowerCase(),
    });
    if (!user) {
      return res.status(401).json({ msg: "Tên đăng nhập không tồn tại." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Mật khẩu không chính xác." });
    }

    const dataForAccessToken = {
      userID: user.UserID,
    };
    const accessToken = await generateToken(
      dataForAccessToken,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE,
    );
    if (!accessToken) {
      return res
        .status(401)
        .json({ msg: "Đăng nhập không thành công, vui lòng thử lại." });
    }

    const refreshToken = await generateToken(
      dataForAccessToken,
      process.env.REFRESH_TOKEN_SECRET,
      tokenLife || process.env.REFRESH_TOKEN_LIFE,
    );
    await userModel.updateToken({ userID: user.UserID, refreshToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: tokenLife && tokenLife * 1000,
      Path: "/",
    });
    return res.json({
      msg: "Đăng nhập thành công.",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkToken = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    const verified = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.json({ verified });
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      // Lấy refresh token từ body
      const refreshToken = req.cookies.jwt;
      if (!refreshToken) {
        return res.status(400).json({ msg: "Không tìm thấy refresh token." });
      }

      const verifyRefreshToken = await verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      if (!verifyRefreshToken) {
        return res.status(400).json({ msg: "Refresh token không hợp lệ." });
      }

      const userID = verifyRefreshToken.payload.userID; // Lấy userID từ payload
      const user = await userModel.getByID({ id: userID });
      if (!user) {
        return res.status(401).json({ msg: "User không tồn tại." });
      }

      // Tạo access token mới
      const accessToken = await generateToken(
        {
          userID,
        },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE,
      );
      if (!accessToken) {
        return res.status(400).json({
          msg: "Tạo access token không thành công, vui lòng thử lại.",
        });
      }
      return res.json({
        accessToken,
      });
    }

    return res.status(406).json({ message: "Unauthorized" });
  } catch (error) {
    next(error);
  }
};
