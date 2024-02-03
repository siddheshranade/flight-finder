import { Octokit } from "@octokit/core";
import { google } from "googleapis";
import Handlebars from "handlebars";
import fs from "fs-extra";

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "siddheshranade/flight-finder";

const PULL_REQUST_INFO = {
  id: process.env.PR_NUMBER || 49,
  owner: GITHUB_REPOSITORY.split("/")[0],
  repoName: GITHUB_REPOSITORY.split("/")[1],
  username: process.env.GITHUB_ACTOR,
  gitHubToken: process.env.GITHUB_TOKEN,
};

// siddhesh@cesium.com sheets
const GOOGLE_SHEETS_INFO = {
  individualCLASheetId: "1oRRS8OG4MfXaQ8uA4uWQWukaOqxEE3N-JuqzrqGGeaE",
  corporateCLASheetId: "1dnoqifzpXB81G1V4bsVJYM3D19gXuwyVZZ-IgNgCkC8",
};

// ranade.siddhesh@gmail.com sheets
// const GOOGLE_SHEETS_INFO = {
//     individualCLASheetId: "1Iyaj2bct-BLJmfyJFVufQgB02fhuevZQlDWN19c8WzI",
//     corporateCLASheetId: "1J9scmTeH-zdC4mrZofg_rGWljCHxlqSzt4jCFYrtgCU",
//   };

// const GOOGLE_API_KEY = "AIzaSyBNw0QkoQeeSDLShH5oRFQsafCkqUSBXu4"; // personal
const GOOGLE_API_KEY = "AIzaSyDMj0_PqIApqk-2oYhRjJaIYI_HvzxHN4E"; // cesium

/* TODO: Change to actual link */
const LINKS = {
  contributorsListURL: "https://google.com",
};

const GOOGLE_INFO = [
    "service_account",
    "cla-checking-test",
    "2ca902fd1e98c42f514c395d1926dc64464e8268",
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVlB8SxNcogpRt\nDnLewY/tcwxvN+8PSTjBjVF7BwenYcgZ6i+abPVVfoMJ3G8w3VV2WNszNTEaK2ct\nqW/unGvTphF7+0kCBVZ5wMjAAlpN8VBA3VwzWd0T3kzlfmcGEWBMvcFRAVmVat86\nbO557GLtMzkXxMaeAXFiDWJ+HNFY5SttefSOxeh96U7XjIuGNZERkNmxinhXmU/O\n2qKOiT9yp9l8E6MS8aE8hUUY82z5WkcS1imjvOzxoDMmF4rIDeAiqaaygdmx8TUp\niQJEOQhfS8a2iJuCnI/zP8LTonnKYaIgh7EXYdtzxETQbzJEfEwo4pQ3ZqvLMDpF\nxOS9NfIZAgMBAAECggEALE1kka3bjJdjhuilmr/PZVuFQ4e4crUHTRzNf0XSyF1f\n1sJNXAzIahLLRy8esGXk/Z7KX0mkFQ/WP/JC2d2//x/WRh+2gfEOAkTjT3LdfQf2\nk/Hm128HTQECdeM9pxRRI7IDyNQNG1GXGuUwJYHLdnT23Y+PfISDmql4mfzLzxKf\nZNePGSl2wCsz9HtEbZDubQuLmTz2xikW6i63SY4yQUFlWhSiM1iQJgdMfPEXb0ZU\nJGj//sCVxAFfvBPlV/RXcRHcBjlQUP3nz4JelgqO33M8HNlXckD6kTecpPTUj3nL\nofSdYBkhEcXXQT8KkF47b9q6ORW8z0zy3pwcZ/3epQKBgQDuFwf1MtuhJayQ6Ynd\n2nG7vz23u0ViyJalYUJV9G+UXeFTS9TF/0ZZkViC4zucBtJbWYoYo0N0EFhUhwCw\n865yzgJcFuyUqQXIOb3wQFhbGgMb5FBNB8sU0sO4Lb5sN2NSA+V0jqJwWMYY4Z2U\nd/dgj+wTl1+g0OUMJw0lPoZmZQKBgQDlpRFSjDZIw5KsIWgmHZg11VrTy+qqIc3w\n24MJ/pvkQSTz4eDq2jphbHeK+i0So4v0/muPJQGOwEai5yoR5gFFhcd3zT/eO5FE\nzvKekgPYpOTeXIO7BJmtXZlI6Ik0c2RlexoaImrVZZ1E2ZqxdyQdsT42F/YYtbkt\nKJJbmLl3pQKBgQCzEOtRRQDeQEF7c8nW65YiiIDYkKZs10RF+dI0Z3UL91eimCPd\nDlNQxfn15wVMIe1P+xXb1d7Dig+E80xXyc5oVfx8WllwrXbF0nfCHALX8cZo0dx7\nMuNQM/wzp2PSbA3s/zUx5pzRNlM3H2iu41NQcq4xReYMQ1AhRbWjT1Ux6QKBgFao\nmsfWx2lf/ApetOmlQ1oVQCgqjExVY1yfyWxNG1DgUGyD8ZdOcLdw8g+M5tNgyiDS\nnY4v/c17u2wf5Z1JeXNdz27jElXvjpszqRSzryXi28cZjFBXpRJp/r0nmxci8GDn\nOmtgT4ZlyRpBL4IGnqdhykMpeaHLeayT4d8U2/BNAoGBAIwAWTalDPr/7huJ0K/J\nc6VUUJTsE9T/w0mgVPa6lQD+y+ANg+lhhjeeqadwa3ZDVMDvPechAQH57PXbDbVG\nj4DhNNC7HSZE6p5Ehjz8E7LrtEwbH12eXJCBRHpPnMnyovuN3QkmY8r4PTJAoHgc\ndCtp8ZwuSkSrwYk7aL01OCF3\n-----END PRIVATE KEY-----\n",
    "siddhesh@cla-checking-test.iam.gserviceaccount.com",
    "117725460460642833499",
    "https://accounts.google.com/o/oauth2/auth",
    "https://oauth2.googleapis.com/token",
    "https://www.googleapis.com/oauth2/v1/certs",
    "https://www.googleapis.com/robot/v1/metadata/x509/siddhesh%40cla-checking-test.iam.gserviceaccount.com",
    "googleapis.com"
];

const JSONString = `
{
    "type": "${GOOGLE_INFO[0]}",
    "project_id": "${GOOGLE_INFO[1]}",
    "private_key_id": "${GOOGLE_INFO[2]}",
    "private_key": "${GOOGLE_INFO[3]}",
    "client_email": "${GOOGLE_INFO[4]}",
    "client_id": "${GOOGLE_INFO[5]}",
    "auth_uri": "${GOOGLE_INFO[6]}",
    "token_uri": "${GOOGLE_INFO[7]}",
    "auth_provider_x509_cert_url": "${GOOGLE_INFO[8]}",
    "client_x509_cert_url": "${GOOGLE_INFO[9]}",
    "universe_domain": "${GOOGLE_INFO[10]}"
}
`;

const JSONObject = {
    type: GOOGLE_INFO[0],
    project_id: GOOGLE_INFO[1],
    private_key_id: GOOGLE_INFO[2],
    private_key: GOOGLE_INFO[3],
    client_email: GOOGLE_INFO[4],
    client_id: GOOGLE_INFO[5],
    auth_uri: GOOGLE_INFO[6],
    token_uri: GOOGLE_INFO[7],
    auth_provider_x509_cert_url: GOOGLE_INFO[8],
    client_x509_cert_url: GOOGLE_INFO[9],
    universe_domain: GOOGLE_INFO[10],
};

// console.log('JSON: \n', );

const main = async () => {
  console.log("main()");
  console.log(
    PULL_REQUST_INFO.repoName,
    PULL_REQUST_INFO.owner,
    PULL_REQUST_INFO.username
  );

  let hasSignedCLA;
  let errorFoundOnCLACheck;

  try {
    hasSignedCLA = await checkIfUserHasSignedAnyCLA();
  } catch (error) {
    console.log("ERROR2 ", error);
    errorFoundOnCLACheck = error.toString();
  }

  console.log("pre-comment...");
  const response = await postCommentOnPullRequest(
    hasSignedCLA,
    errorFoundOnCLACheck
  );
  console.log("post-comment, response: ", response);
};

const checkIfUserHasSignedAnyCLA = async () => {
  let foundIndividualCLA = await checkIfIndividualCLAFound();
  console.log("CLA #1 ", foundIndividualCLA);
  if (foundIndividualCLA) {
    return true;
  }

  let foundCorporateCLA = await checkIfCorporateCLAFound();
  console.log("CLA #2 ", foundCorporateCLA);
  return foundCorporateCLA;
};

const checkIfIndividualCLAFound = async () => {
  const response = await getValuesFromGoogleSheet(
    GOOGLE_SHEETS_INFO.individualCLASheetId,
    "D2:D"
  );

  const rows = response.data.values;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length === 0) {
      continue;
    }

    const rowUsername = rows[i][0].toLowerCase();
    if (PULL_REQUST_INFO.username.toLowerCase() === rowUsername) {
      return true;
    }
  }

  return false;
};

const checkIfCorporateCLAFound = async () => {
  const response = await getValuesFromGoogleSheet(
    GOOGLE_SHEETS_INFO.corporateCLASheetId,
    "H2:H"
  );

  const rows = response.data.values;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length === 0) {
      continue;
    }

    // We're more lenient with the ScheduleA username check since it's an unformatted text field.
    let rowScheduleA = rows[i][0].toLowerCase();
    console.log('GOT VAL ', rowScheduleA);
    rowScheduleA = rowScheduleA.replace(/\n/g, " ");
    const words = rowScheduleA.split(" ");

    for (let j = 0; j < words.length; j++) {
      // Checking for substrings because many input their
      // GitHub username as "github.com/username".
      if (words[j].includes(PULL_REQUST_INFO.username.toLowerCase())) {
        return true;
      }
    }
  }

  return false;
};

const getValuesFromGoogleSheet = async (sheetId, cellRanges) => {
  const googleSheetsApi = await getGoogleSheetsApiClient();

  console.log('GET');
  return googleSheetsApi.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: cellRanges,
  });
};

const getGoogleSheetsApiClient = async () => {
  const googleConfigFilePath = 'GoogleConfig.json';
  console.log('writing JSON to file...');
  fs.writeFileSync(googleConfigFilePath, JSON.stringify(JSONObject));    

  const auth = new google.auth.GoogleAuth({
    keyFile: googleConfigFilePath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const googleAuthClient = await auth.getClient();

//   return google.sheets({ version: "v4", auth: GOOGLE_API_KEY }); // API_KEY auth and not Service Account

  return google.sheets({ version: "v4", auth: googleAuthClient });
};

const postCommentOnPullRequest = async (hasSignedCLA, errorFoundOnCLACheck) => {
  console.log("adding comment...");

  const octokit = new Octokit();
  return octokit.request(
    `POST /repos/${PULL_REQUST_INFO.owner}/${PULL_REQUST_INFO.repoName}/issues/${PULL_REQUST_INFO.id}/comments`,
    {
      owner: PULL_REQUST_INFO.username,
      repo: PULL_REQUST_INFO.repoName,
      issue_number: PULL_REQUST_INFO.id,
      body: getCommentBody(hasSignedCLA, errorFoundOnCLACheck),
      headers: {
        authorization: `bearer ${PULL_REQUST_INFO.gitHubToken}`,
        accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
};

const getCommentBody = (hasSignedCLA, errorFoundOnCLACheck) => {
  console.log("getting comment template...");

  const commentTemplate = fs.readFileSync(
    "./.github/scripts/templates/pullRequestComment.hbs",
    "utf-8"
  );
  const getTemplate = Handlebars.compile(commentTemplate);
  const commentBody = getTemplate({
    errorCla: errorFoundOnCLACheck,
    hasCla: hasSignedCLA,
    username: PULL_REQUST_INFO.username,
    contributorsUrl: LINKS.contributorsListURL,
  });

  return commentBody;
};

main();
