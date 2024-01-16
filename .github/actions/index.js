import { Octokit } from "@octokit/core";

console.log('1. Loaded index.js! 🎁');

const GITHUB_FINE_GRAIN_TOKEN = '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';
const GITHUB_CLASSIC_TOKEN = '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'; // created 1st
const GITHUB_CLASSIC_TOKEN_BETTER = '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'; // created 3rd - WORKS (not that others don't, haven't tested)

const GITHUB_UMD_ACCOUNT_FINE_GRAIN = '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'; // has ALL permissions
const GITHUB_UMD_ACCOUNT_CLASSIC = 
    // 'ghp_' +
    'h4iqaiS5ukQ92QOamLEOO9piw8KzJc3kR3J9'; // has ALL permissions

async function commentOnPullRequest() {
    console.log('3. Inside async - start! 🎁');
    const octokit = new Octokit();


    // //DOES work:
    // const { data } = await octokit.request("GET /users/siddheshranade/repos", {
    //     username: "siddheshranade",
    //     headers: {
    //         "If-None-Match": "",
    //         authorization: `${GITHUB_CLASSIC_TOKEN_BETTER}`
    //     }
    // });




// //DOES work:
//   const { data } = await octokit.request('GET /repos/siddhesh-umd/temp/issues', {
//     owner: 'siddhesh-umd',
//     repo: 'temp',
//     headers: {
//       authorization: `${GITHUB_UMD_ACCOUNT_CLASSIC}`,  
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   });    
//   console.log('RESPONSE ', data);

  //does NOT work:
    const response = await octokit.request('POST /repos/siddhesh-umd/temp/issues/1/comments', {
        owner: 'siddhesh-umd',
        repo: 'temp',
        issue_number: '1',
        body: 'Comment coming from from workflow! 🚀',
        headers: {
          authorization: `${GITHUB_UMD_ACCOUNT_CLASSIC}`,    
          'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    console.log('RESPONSE ', response);




    console.log('4. Inside async - end! 🎁');
}

console.log('2. Calling async function!! 🎁');
commentOnPullRequest();