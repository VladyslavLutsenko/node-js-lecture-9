const {createError} = require('../helpers');
const {User} = require('../models');
const {bcrypt, jwt} = require('../helpers');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  console.log(id)
  return await User.findById(id);
};

const findAll = async () => {
  return await User.find();
};

const updateById = async (id, updatedUser) => {
  return await User.findByIdAndUpdate(id, updatedUser);
};

const register = async user => {
  try {
    const existingUser = await findByEmail(user.email);
    if (existingUser) {
      throw createError(409, 'User already exists');
    }

    const passwordHash = await bcrypt.hashString(user.password)
    const dbUser = (await User.create({...user, password: passwordHash})).toObject();

    const {password, ...newUser} = dbUser;

    return newUser;
  } catch (error) {
    throw createError(error.status ?? 400, error.errorMessage ?? error.message);
  }
};

const login = async ({email, password}) => {
  const existingUser = await findByEmail(email);
  if (!existingUser || !(await bcrypt.compareHashes(password, existingUser.password))) {
    throw createError(401, 'Email and/or password do not match');
  }

  const id = existingUser._id;
  const payload = {
    id,
  }
  const token = jwt.sign(payload);

  await saveToken(id, token);

  return {
    token,
  };
}

const saveToken = async (id, token) => {
  return await updateById(id, { token });
}

const logout = async (id) => {
  const existingUser = await findById(id);
  if (!existingUser) {
    throw createError(404, 'User not found');
  }

  await updateById(id, { token: null });
}

module.exports = {
  register,
  login,
  findAll,
  findById,
  logout,
  saveToken,
};
