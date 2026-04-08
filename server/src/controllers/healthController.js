const healthController = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
    message: 'Server is running',
  });
};

module.exports = { healthController };
