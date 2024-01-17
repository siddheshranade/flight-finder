import { Octokit } from "@octokit/core";
import { google } from "googleapis";
import Handlebars from "handlebars";
import fs from "fs-extra";
console.log('1. Loaded index.js! 🎁');

// const GITHUB_FINE_GRAIN_TOKEN = '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';
// const GITHUB_CLASSIC_TOKEN = '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'; // created 1st
// const GITHUB_CLASSIC_TOKEN_BETTER = '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'; // created 3rd - WORKS (not that others don't, haven't tested)

// const GITHUB_UMD_ACCOUNT_FINE_GRAIN = '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'; // has ALL permissions
// const GITHUB_UMD_ACCOUNT_CLASSIC = 
//     // 'ghp_' +
//     'h4iqaiS5ukQ92QOamLEOO9piw8KzJc3kR3J9'; // has ALL permissions

function getCommentBody() {
    // const template = '<span>{{greetingMsg}}</span>';
    const template = fs.readFileSync('./.github/actions/templates/pullRequestComment.hbs', 'utf-8');
    const templateFunction = Handlebars.compile(template);
    const commentBody = templateFunction({ 
        askAboutContributors: true,
        userName: "siddheshranade",
        contributorsUrl: "https://google.com"
     });

     
    // console.log('SIDBOI GOT \n', commentBody);    

    return commentBody;
};

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

// normal GET (WORKS with GITHUB_CLASSIC_TOKEN_BETTER and with process.env.GITHUB_TOKEN)
// const { data } = await octokit.request('GET /repos/siddheshranade/flight-finder/issues', {
//     owner: 'siddheshranade',
//     repo: 'flight-finder',
//     headers: {
//       authorization: `${process.env.GITHUB_TOKEN}`,  
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   });    
//   console.log('RESPONSE ', data);



// umd GET (WORKS)
//   const { data } = await octokit.request('GET /repos/siddhesh-umd/temp/issues', {
//     owner: 'siddhesh-umd',
//     repo: 'temp',
//     headers: {
//       authorization: `${GITHUB_UMD_ACCOUNT_CLASSIC}`,  
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   });    
//   console.log('RESPONSE ', data);

// normal POST WORKS NOW!!!

const commentBody = getCommentBody();

const response = await octokit.request(`POST /repos/siddheshranade/flight-finder/issues/${process.env.PR_NUMBER}/comments`, {
    owner: process.env.GITHUB_ACTOR,
    repo: 'flight-finder',
    issue_number: process.env.PR_NUMBER,
    body: commentBody,
    headers: {
      authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',    
      'X-GitHub-Api-Version': '2022-11-28'
    }
});
console.log('RESPONSE ', response);
    console.log('4. Inside async - end! 🎁');
}

async function getValueFromSheet() {
    console.log('#3');
    const sheets = google.sheets('v4');

    const auth = new google.auth.GoogleAuth({
        keyFile: './cla-checking-test-gcp-service-key.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    console.log('#4');

    const authClient = await auth.getClient();
    console.log('#5');
    sheets.spreadsheets.values.get({
        spreadsheetId: '1oRRS8OG4MfXaQ8uA4uWQWukaOqxEE3N-JuqzrqGGeaE',
        range: 'Sheet1!A1',
        auth: authClient
    },
    (err, response) => {
        if (err) {
            console.error('The API returned an error:', err);
            return;
        }

        const value = response.data.values[0][0];
        console.log('VALUE ', value);
    }
    );
    console.log('#6 after get');
}

console.log('2. Calling async function!! 🎁');
commentOnPullRequest();
// getValueFromSheet();


