// All available sheet types in the application
const SHEET_TYPES = {
  // Core sheets
  APNA_COLLEGE: 'apnaCollege',
  LOVE_BABBAR: 'loveBabbar',
  
  // Striver sheets
  STRIVER_SDE: 'striverSDE',
  STRIVER_SDE_COMPLETE: 'striverSDEComplete',
  VISION: 'vision',
  NEETCODE_150: 'neetcode150',
  SYSTEM_DESIGN: 'systemDesign',
  LEETCODE_TOP_150: 'leetcodeTop150',
  CP_31: 'cp31',
  STRIVER_A2Z: 'striverA2Z',
  STRIVER_79: 'striver79',
  STRIVER_COMPLETE: 'striverComplete',
  STRIVER_MASTER: 'striverMaster',
  STRIVER_CP: 'striverCP',
  STRIVER_ARRAYS: 'striverArrays',
  STRIVER_BINARY_SEARCH: 'striverBinarySearch',
  
  // Other popular sheets
  BLIND_75: 'blind75',
  COMPANY_WISE: 'companyWise',
  
  // Additional sheets based on data files
  ALL_STEPS: 'allSteps',
  REMAINING_STEPS: 'remainingSteps',
  FINAL_STEPS: 'finalSteps',
  LAST_STEPS: 'lastSteps'
};

// Function to validate if a sheet type is supported
const isValidSheetType = (sheetType) => {
  return Object.values(SHEET_TYPES).includes(sheetType);
};

// Function to get default sheet type
const getDefaultSheetType = () => {
  return SHEET_TYPES.APNA_COLLEGE;
};

// Function to get all sheet types
const getAllSheetTypes = () => {
  return Object.values(SHEET_TYPES);
};

module.exports = {
  SHEET_TYPES,
  isValidSheetType,
  getDefaultSheetType,
  getAllSheetTypes
};