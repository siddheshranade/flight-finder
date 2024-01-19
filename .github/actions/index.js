import { Octokit } from "@octokit/core";
import { google } from "googleapis";
import Handlebars from "handlebars";
import fs from "fs-extra";
console.log('loaded index.js 🎁');

async function commentOnPullRequest() {
    const settings = getSettings();
    let hasCla;
    let errorCla;

    // hasCla = await checkIfHasCla(settings.owner);

    try {
        hasCla = await checkIfHasCla(settings.owner);
    } catch (error) {
        // TODO check what error printed for each kind of failure
        console.log('--error--\n');
        console.log(error);
        errorCla = error.toString();
        console.log('--to print-- ', errorCla);
        console.log('-- done printing error --');
    }

    console.log('HAS CLA? ', hasCla);

    const response = await writeComment(settings, hasCla, errorCla);
    console.log('RESPONSE ', response);
    
};

const getSettings = () => {
    return {
        owner: process.env.GITHUB_ACTOR || 'siddheshranade',
        repo: 'flight-finder',
        pull_request_id: process.env.PR_NUMBER,
    }
}

const checkIfHasCla = async (username) => {    
    const googleSheetsApi = await getGoogleSheetsApiClient();
    // console.log('--googleSheetsApi-- ', googleSheetsApi);
    console.log('--1--');
    let foundIndividualCLA = await checkIfIndividualClaFound(googleSheetsApi, username);
    console.log('--2--');
    let foundCorporateCLA = await checkIfCorporateClaFound(googleSheetsApi, username);
    console.log('--3--');
    console.log('cla bool result ', foundIndividualCLA, foundCorporateCLA);

    return foundIndividualCLA && foundCorporateCLA;
}

const getGoogleSheetsApiClient = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'GoogleConfig.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    console.log('--auth-- ', auth);
    const googleAuthClient = await auth.getClient();

    return google.sheets({version: 'v4', auth: googleAuthClient });
}

const checkIfIndividualClaFound = async (googleSheetsApi, username) => {
    const response = await googleSheetsApi.spreadsheets.values.get({
        // spreadsheetId: '1oRRS8OG4MfXaQ8uA4uWQWukaOqxEE3N-JuqzrqGGeaE2',// fake id
        spreadsheetId: '1oRRS8OG4MfXaQ8uA4uWQWukaOqxEE3N-JuqzrqGGeaE',
        range: 'D2:D'
    });

    console.log('--response1-- ', response.status);

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
    console.log('check2');
    const response = await googleSheetsApi.spreadsheets.values.get({
        // spreadsheetId: '1dnoqifzpXB81G1V4bsVJYM3D19gXuwyVZZ-IgNgCkC82', // fake
        spreadsheetId: '1dnoqifzpXB81G1V4bsVJYM3D19gXuwyVZZ-IgNgCkC8',
        range: 'H2:H'
    });

    console.log('--response2-- ', response.status);

    const rows = response.data.values;
    // console.log('rows ', rows);
    for (let i = 0; i < rows.length; i++) {
        if(rows[i].length === 0) {
            continue;
        }

        // We're more lenient with the ScheduleA username check since it's an unformatted text field.
        let rowScheduleA = rows[i][0].toLowerCase();
        rowScheduleA = rowScheduleA.replace(/\n/g, ' ');
        const words = rowScheduleA.split(' ');

        for (let j = 0; j < words.length; j++) {
            // Checking for substrings because many input their GitHub username as "github.com/username".
            if (words[j].includes(username.toLowerCase())) {
                return true;
            }
        }
    }

    return false;
};

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
    const template = fs.readFileSync('./.github/actions/templates/pullRequestComment2.hbs', 'utf-8');
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