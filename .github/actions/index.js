import { Octokit, App } from "octokit";

console.log('1. Loaded index.js! 🎁');

async function commentOnPullRequest() {
    console.log('3. Inside async! 🎁');
    const githubApiToken = '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';
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: githubApiToken });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log("Hello, %s", login);

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