const mongoose = require('mongoose')
const transferSchema =  mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },

    fromTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },

    toTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },

    transferFee: {
      type: Number,
      default: 0, 
    },

    transferType: {
      type: String,
      enum: ['permanent', 'loan', 'free'],
      default: 'permanent',
    },

    transferDate: {
      type: Date,
      default: Date.now,
    },
    transferDateExpired:Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transfer', transferSchema);
