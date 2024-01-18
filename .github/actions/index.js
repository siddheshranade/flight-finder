import { Octokit } from "@octokit/core";
import { google } from "googleapis";
import Handlebars from "handlebars";
import fs from "fs-extra";
console.log('loaded index.js 🎁');

// const GITHUB_FINE_GRAIN_TOKEN = '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';
// const GITHUB_CLASSIC_TOKEN = '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'; // created 1st
// const GITHUB_CLASSIC_TOKEN_BETTER = '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'; // created 3rd - WORKS (not that others don't, haven't tested)

// const GITHUB_UMD_ACCOUNT_FINE_GRAIN = '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'; // has ALL permissions
// const GITHUB_UMD_ACCOUNT_CLASSIC = 
//     // 'ghp_' +
//     'h4iqaiS5ukQ92QOamLEOO9piw8KzJc3kR3J9'; // has ALL permissions

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


async function commentOnPullRequest() {

    const settings = getSettings();
    const hasCla = await checkIfHasCla(settings.owner);
    console.log('HAS CLA? ', hasCla); 
    const errorCla = false; // TODO set this
    const response = await writeComment(settings, hasCla, errorCla);
    console.log('RESPONSE ', response);
    
};

const getSettings = () => {
    return {
        owner: process.env.GITHUB_ACTOR,
        repo: 'flight-finder',
        pull_request_id: process.env.PR_NUMBER,
    }
}

const checkIfHasCla = async (username) => {    
    const googleSheetsApi = await getGoogleSheetsApiClient();

    let foundIndividualCLA = await checkIfIndividualClaFound(googleSheetsApi, username);
    let foundCorporateCLA = await checkIfCorporateClaFound(googleSheetsApi, username);
    console.log('bool ', foundIndividualCLA, foundCorporateCLA);

    return foundIndividualCLA && foundCorporateCLA;
}

const writeComment = async (settings, hasCla, errorCla) => {
    const octokit = new Octokit();

    console.log('before request');
    return octokit.request(`POST /repos/siddheshranade/flight-finder/issues/${process.env.PR_NUMBER}/comments`, {
    owner: settings.owner,
    repo: settings.repo,
    issue_number: settings.pull_request_id,
    body: getCommentBody(settings.owner, hasCla, errorCla),
    headers: {
      authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',    
      'X-GitHub-Api-Version': '2022-11-28'
    }
});
}

const getCommentBody = (username, hasCla, errorCla) => {
    // const template = '<span>{{greetingMsg}}</span>';
    const template = fs.readFileSync('./.github/actions/templates/pullRequestComment.hbs', 'utf-8');
    const templateFunction = Handlebars.compile(template);
    const commentBody = templateFunction({ 
        errorCla: errorCla,
        hasCla: hasCla,
        username: username,
        contributorsUrl: "https://google.com" /* TODO configure */
     });

    // console.log('SIDBOI GOT \n', commentBody);    
    return commentBody;
};

commentOnPullRequest();

// const getGoogleSheetsApiClient = async () => {
async function getGoogleSheetsApiClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'GoogleConfig.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const googleAuthClient = await auth.getClient();

    return google.sheets({version: 'v4', auth: googleAuthClient });
}

const checkIfIndividualClaFound = async (googleSheetsApi, username) => {
    const response = await googleSheetsApi.spreadsheets.values.get({
        spreadsheetId: '1oRRS8OG4MfXaQ8uA4uWQWukaOqxEE3N-JuqzrqGGeaE',
        range: 'D2:D'
    });

    const rows = response.data.values;

    for (let i = 0; i < rows.length; i++) {
        if(rows[i].length === 0) {
            continue;
        }
        const rowUsername = rows[i][0].toLowerCase();
        if (username.toLowerCase() === rowUsername) {
            return true;
        }
    }

    return false;
};

const checkIfCorporateClaFound = async (googleSheetsApi, username) => {
    console.log('corporate cla check...');
    const response = await googleSheetsApi.spreadsheets.values.get({
        spreadsheetId: '1dnoqifzpXB81G1V4bsVJYM3D19gXuwyVZZ-IgNgCkC8',
        range: 'H2:H'
    });

    const rows = response.data.values;
    // console.log('rows ', rows);
    for (let i = 0; i < rows.length; i++) {
        if(rows[i].length === 0) {
            continue;
        }
        let rowScheduleA = rows[i][0].toLowerCase();
        // We're a little more lenient with the ScheduleA username check, since it's an unformatted text field.
        // We split the ScheduleA field by whitespace see if we can find the GitHub username in there.
        rowScheduleA = rowScheduleA.replace(/\n/g, ' ');
        const words = rowScheduleA.split(' ');

        for (let j = 0; j < words.length; j++) {
            if (words[j].includes(username.toLowerCase())) {
                // console.log('found in ', words[j]);
                return true;
            }
        }
    }

    return false;
};