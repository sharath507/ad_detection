// // models/PatientInfo.js
// const patientInfoSchema = new Schema({
//   patientId: { type: String, primary: true, required: true },
//   userId: { type: String, ref: 'User', required: true },
//   personal_information: {
//     name: String,
//     date_of_birth: Date,
//     education_level: String,
//     gender: String,
//     ethnicity: String
//   },
//   medical_history: {
//     memory_or_thinking_problems: { response: String, frequency: String },
//     family_memory_problems: String,
//     balance_problems: {
//       response: String,
//       known_cause: { response: String, cause_description: String }
//     },
//     stroke_history: { major_stroke: String, minor_or_mini_stroke: String },
//     mood_status: { sad_or_depressed: String, frequency: String },
//     personality_change: { response: String, description_of_change: String },
//     daily_activity_difficulty_due_to_thinking: String
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });



// models/PatientInfo.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientInfoSchema = new Schema({
  patientId: { type: String, unique: true, required: true },
  userId: { type: String, ref: 'User', required: true },
  personal_information: {
    name: String,
    date_of_birth: Date,
    education_level: String,
    gender: String,
    ethnicity: String
  },
  medical_history: {
    memory_or_thinking_problems: { response: String, frequency: String },
    family_memory_problems: String,
    balance_problems: {
      response: String,
      known_cause: { response: String, cause_description: String }
    },
    stroke_history: { major_stroke: String, minor_or_mini_stroke: String },
    mood_status: { sad_or_depressed: String, frequency: String },
    personality_change: { response: String, description_of_change: String },
    daily_activity_difficulty_due_to_thinking: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientInfo', patientInfoSchema);
