const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createChallenge,
  getActiveChallenges,
  joinChallenge,
  submitAnswer,
  getChallengeDetails,
  getChallengeResults
} = require('../controllers/challengeController');

// Create new challenge
router.post('/', auth, createChallenge);

// Get active challenges
router.get('/active', auth, getActiveChallenges);

// Get challenge details with timer
router.get('/:challengeId', auth, getChallengeDetails);

// Join challenge
router.post('/:challengeId/join', auth, joinChallenge);

// Submit answer
router.post('/:challengeId/submit', auth, submitAnswer);

// Get challenge results
router.get('/:challengeId/results', auth, getChallengeResults);

module.exports = router;