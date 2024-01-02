import { context, getOctokit } from '@actions/github';

console.log('1. Loaded index.js! 🎁');

async function commentOnPullRequest() {
    console.log('3. Inside async! 🎁');
    const token = process.env.GITHUB_TOKEN;
    const octokit = getOctokit(token);

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