import { Octokit } from "@octokit/core";

console.log('1. Loaded index.js! 🎁');

const GITHUB_FINE_GRAIN_TOKEN = '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';
const GITHUB_CLASSIC_TOKEN = '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'; // created 1st
const GITHUB_CLASSIC_TOKEN_BETTER = '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'; // created 3rd

async function commentOnPullRequest() {
    console.log('3. Inside async - start! 🎁');

    const octokit = new Octokit();
    const { data } = await octokit.request("GET /users/siddheshranade/repos", {
        username: "siddheshranade",
        headers: {
            "If-None-Match": "",
            authorization: `${GITHUB_CLASSIC_TOKEN_BETTER}`
        }
    });

    console.log('GOT DATA ', data);

    // const octokit = new Octokit({ auth: `token ${GITHUB_CLASSIC_TOKEN_BETTER}` });

    // octokit.request('GET /').then(console.log, console.log);

    // await octokit.request('GET /user', {
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    //   });

    // const {
    // data: { login },
    // } = await octokit.rest.users.getAuthenticated();
    // console.log("Hello, %s", login);

// await octokit.rest.issues.create({
//     owner: "siddheshranade",
//     repo: "flight-finder",
//     title: "Issue from Octokit",
//     body: "I created this issue using Octokit!",
//   });

    // const { owner, repo, number } = context.issue;

    // await octokit.issues.createComment({
    //     owner,
    //     repo,
    //     issue_number: number,
    //     body: 'Testing comment from GitHub Actions! Messi.'
    // });
    console.log('4. Inside async - end! 🎁');
}

console.log('2. Calling async function!! 🎁');
commentOnPullRequest();