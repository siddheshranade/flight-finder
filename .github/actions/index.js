import { Octokit, App } from "octokit";

console.log('1. Loaded index.js! 🎁');

const GITHUB_FINE_GRAIN_TOKEN = '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';
const GITHUB_CLASSIC_TOKEN = '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';
const GITHUB_CLASSIC_TOKEN_BETTER = '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';

async function commentOnPullRequest() {
    console.log('3. Inside async! 🎁');
    const githubApiToken = GITHUB_CLASSIC_TOKEN_BETTER;
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: githubApiToken });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

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
    console.log('4. Inside async! 🎁');
}

console.log('2. Calling async function!! 🎁');
commentOnPullRequest();