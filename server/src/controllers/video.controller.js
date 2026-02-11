const { Video, Tag } = require('../models');
const { Op } = require('sequelize');

// ---------- GET ALL VIDEOS ----------
exports.getAllVideos = async (req, res) => {
  try {
    const { search, tags } = req.query;

    let whereClause = {};
    let includeClause = [
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: { attributes: [] },
        required: false,
      },
    ];

    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`,
      };
    }

    if (tags) {
      const tagList = tags.split(',');

      includeClause[0].where = {
        name: {
          [Op.in]: tagList,
        },
      };

      includeClause[0].required = true;
    }

    const videos = await Video.findAll({
      where: whereClause,
      include: includeClause,
    });

    res.json(videos);
  } catch (error) {
    console.error('Video Fetch Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ---------- GET VIDEO BY ID ----------
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Video Detail Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
