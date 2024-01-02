import { Octokit, App } from "octokit";

console.log('1. Loaded index.js! 🎁');

async function commentOnPullRequest() {
    console.log('3. Inside async! 🎁');
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ autho: token });

    const { owner, repo, number } = context.issue;

    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: 'Testing comment from GitHub Actions! Messi.'
    });
    console.log('4. Inside async! 🎁');
}

console.log('2. Calling async function!! 🎁');
commentOnPullRequest();