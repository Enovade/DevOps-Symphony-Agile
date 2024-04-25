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
        let agileData = res.data.text
        console.log("----------------Agile Data--------------------")
        
        let newStr = agileData.replace(/```/g, '');
        let iStr = newStr.replace('json', '');
        let theJSON = {};
        theJSON = { "data": iStr }

        console.log(typeof theJSON.data);  // Check the data type
        console.log(Array.isArray(theJSON.data)); // Check if it's truly an array

        let jsonString = JSON.stringify(theJSON.data);
        console.log("JSONString: " + jsonString);
        console.log(typeof jsonString);  // Check the data type
        console.log(Array.isArray(jsonString)); //
        
        let jsonObject = JSON.parse(theJSON.data);
        console.log("JSONObject: " + jsonObject);
        console.log(typeof jsonObject);  // Check the data type
        console.log(Array.isArray(jsonObject)); //
        
        //myjson = JSON.parse(iStr);
        //console.log(theJSON)
        //parseJsonArray(theJSON);
        core.setOutput('jawapan', "Successfully create tasks");
    }
})
.catch(err => {
    console.error(err); 
})

function parseJsonArray(jsonArray) {
    jsonArray.data.forEach(item => {
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
    const myrepo = "POST /repos/" + owner + "/" + repo + "/issues";
    const { data } = await octokit.request(myrepo, {
      owner: owner,
      repo: repo,
      title: title,
      body: body,
      labels: labels,
      assignees: [assignees],
    });
    console.log(data);
  }