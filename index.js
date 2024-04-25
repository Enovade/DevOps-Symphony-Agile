const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require("@octokit/core");

const agileURL = core.getInput('agileURL', { required: true });
const mymd = core.getInput('result', { required: true });
const mytoken = core.getInput('uid', { required: true });

const octokit = new Octokit({
  auth: mytoken,
});

const { context } = github;
const { owner, repo } = context.repo;

console.log(owner, repo)

console.log(mymd)

var agileData = {}
var resultData = ""

 let payload = {
     "question" : mymd
 }
 let getAnalyze = axios.post(agileURL, payload)
.then(res => {
    if (res.status === 200) {
        const agileData = res.data.text
        console.log("----------------Agile Data--------------------")
        console.log(agileData)
        parseJsonArray(agileData);
        core.setOutput('jawapan', "Successfully create tasks");
    }
})
.catch(err => {
    console.error(err); 
})

function parseJsonArray(jsonArray) {
    jsonArray.forEach(item => {
        console.log('Title:', item.Title);
        console.log('Body:', item.Body);
        console.log('Labels:', item.Labels);
        console.log('Milestone:', item.Milestone);
        console.log('Assignees:', item.Assignees);
        console.log('-------------------------');
        createIssue(item.Title, item.Body, item.Labels, item.Milestone, item.Assignees);
    });
}

async function createIssue( title, body, labels, milestone, assignees) {
    const { data } = await octokit.request("POST /repos/Enovade/test-agile/issues", {
      owner: "Enovade",
      repo: "test-agile",
      title: title,
      body: body,
      labels: labels,
      assignees: [assignees],
    });
    console.log(data);
  }