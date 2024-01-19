import { Octokit } from "@octokit/core";
import { google } from "googleapis";
import Handlebars from "handlebars";
import fs from "fs-extra";

const PULL_REQUST_INFO = {
    id: process.env.PR_NUMBER,
    repoName: process.env.GITHUB_REPOSITORY,
    username: process.env.GITHUB_ACTOR,
    githubToken: process.env.GITHUB_TOKEN
};

/**
 * keep secret:
 * individual_cla_id
 * corporate_cla_id
 */

/**
 * other data:
 * contributors URL
 */

const main = async () => {
    console.log('--PULL_REQUST_INFO-- ', PULL_REQUST_INFO);
    let areBothCLAsSigned;
    let errorFoundOnCLACheck;

    try {
        areBothCLAsSigned = await checkIfUserHasSignedBothCLAs(PULL_REQUST_INFO.username);
    } catch (error) {
        errorFoundOnCLACheck = error.toString();
    }

    const response = await postCommentOnPullRequest(areBothCLAsSigned, errorFoundOnCLACheck);
};

const checkIfUserHasSignedBothCLAs = async (username) => {    
    const googleSheetsApi = await getGoogleSheetsApiClient();
    let foundIndividualCLA = await checkIfIndividualCLAFound(googleSheetsApi, username);
    let foundCorporateCLA = await checkIfCorporateCLAFound(googleSheetsApi, username);

    return foundIndividualCLA && foundCorporateCLA;
};

const getGoogleSheetsApiClient = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'GoogleConfig.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const googleAuthClient = await auth.getClient();

    return google.sheets({version: 'v4', auth: googleAuthClient });
};

const checkIfIndividualCLAFound = async (googleSheetsApi, username) => {
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

const checkIfCorporateCLAFound = async (googleSheetsApi, username) => {
    const response = await googleSheetsApi.spreadsheets.values.get({
        spreadsheetId: '1dnoqifzpXB81G1V4bsVJYM3D19gXuwyVZZ-IgNgCkC8',
        range: 'H2:H'
    });

    const rows = response.data.values;
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

const postCommentOnPullRequest = async (areBothCLAsSigned, errorFoundOnCLACheck) => {
    const octokit = new Octokit();

    return octokit.request(`POST /repos/${PULL_REQUST_INFO.username}/${PULL_REQUST_INFO.repoName}/issues/${PULL_REQUST_INFO.id}/comments`, {
        owner: PULL_REQUST_INFO.username,
        repo: PULL_REQUST_INFO.repoName,
        issue_number: PULL_REQUST_INFO.id,
        body: getCommentBody(areBothCLAsSigned, errorFoundOnCLACheck),
        headers: {
            authorization: `bearer ${PULL_REQUST_INFO.githubToken}`,
            accept: 'application/vnd.github+json',    
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
};

const getCommentBody = (areBothCLAsSigned, errorFoundOnCLACheck) => {
    const commentTemplate = fs.readFileSync('./.github/actions/templates/pullRequestComment.hbs', 'utf-8');
    const getTemplate = Handlebars.compile(commentTemplate);
    const commentBody = getTemplate({ 
        errorCla: errorFoundOnCLACheck,
        hasCla: areBothCLAsSigned,
        username: PULL_REQUST_INFO.username,
        contributorsUrl: "https://google.com" /* TODO configure */
     });
 
    return commentBody;
};

main();