const Insights = require("../model/Insights");

const addInsight = async (req, res) => {
  try {
    const insight = new Insights(req.body);
    await insight.save();
    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const insights = await Insights.find();
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addInsight, getInsights };
