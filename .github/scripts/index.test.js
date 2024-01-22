// // index.test.js
// import { 
//   main,
//   checkIfUserHasSignedAnyCLA,
//   getGoogleSheetsApiClient,
//   checkIfIndividualCLAFound,
//   checkIfCorporateCLAFound,
//   postCommentOnPullRequest } from '../index';

  import { testMethod } from './index.js';

// Mock the external dependencies or functions
// jest.mock('../index', () => ({
//   getGoogleSheetsApiClient: jest.fn(),
//   checkIfIndividualCLAFound: jest.fn(),
//   checkIfCorporateCLAFound: jest.fn(),
//   postCommentOnPullRequest: jest.fn(),
// }));

// test('test that unit tests work', async () => {
//   const response = testMethod();
//   expect(response).toBe(true);
//   // checkIfIndividualCLAFound.mockResolvedValue(true);

//   // let individualCLAFound = await checkIfIndividualCLAFound();

//   // expect(individualCLAFound).toBe(true);
// });

describe('Main Function', () => {
  // it('should post comment based on CLA status', async () => {
  //   // Mock external functions
  //   getGoogleSheetsApiClient.mockResolvedValue({ /* mocked client */ });
  //   checkIfIndividualCLAFound.mockResolvedValue(true);
  //   checkIfCorporateCLAFound.mockResolvedValue(false);

  //   // Call the main function
  //   // checkIfCorporateCLAFound(undefined);
  //   main();

  //   // Expectations
  //   expect(postCommentOnPullRequest).toHaveBeenCalledWith(true, undefined);
  // });

//   it('should handle CLA check error', async () => {
//     // Mock external functions
//     getGoogleSheetsApiClient.mockResolvedValue({ /* mocked client */ });
//     checkIfIndividualCLAFound.mockRejectedValue(new Error('CLA check error'));

//     // Call the main function
//     await main();

//     // Expectations
//     expect(postCommentOnPullRequest).toHaveBeenCalledWith(undefined, 'Error: CLA check error');
//   });
// });

// describe('checkIfUserHasSignedAnyCLA Function', () => {
//   it('should return true if individual CLA found', async () => {
//     // Mock external functions
//     const googleSheetsApiMock = { /* mocked client */ };
//     getGoogleSheetsApiClient.mockResolvedValue(googleSheetsApiMock);
//     checkIfIndividualCLAFound.mockResolvedValue(true);

//     // Call the function
//     const result = await checkIfUserHasSignedAnyCLA();

//     // Expectations
//     expect(result).toBe(true);
//   });

//   it('should return false if no individual CLA found but corporate CLA found', async () => {
//     // Mock external functions
//     const googleSheetsApiMock = { /* mocked client */ };
//     getGoogleSheetsApiClient.mockResolvedValue(googleSheetsApiMock);
//     checkIfIndividualCLAFound.mockResolvedValue(false);
//     checkIfCorporateCLAFound.mockResolvedValue(true);

//     // Call the function
//     const result = await checkIfUserHasSignedAnyCLA();

//     // Expectations
//     expect(result).toBe(true);
//   });

//   it('should return false if neither individual nor corporate CLA found', async () => {
//     // Mock external functions
//     const googleSheetsApiMock = { /* mocked client */ };
//     getGoogleSheetsApiClient.mockResolvedValue(googleSheetsApiMock);
//     checkIfIndividualCLAFound.mockResolvedValue(false);
//     checkIfCorporateCLAFound.mockResolvedValue(false);

//     // Call the function
//     const result = await checkIfUserHasSignedAnyCLA();

//     // Expectations
//     expect(result).toBe(false);
//   });
});
