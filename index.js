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
        console.log(agileData)
        console.log("----------------Get Data--------------------")
        
        let newStr = agileData.replace(/```json/g, '');
        newStr = newStr.replace(/```/g, '');
        newStr = newStr.trimStart();
        newStr = newStr.trimEnd();

        // let newStr = agileData.replace(/```json/g, '');
        // let iStr = newStr.replace('json', '');
        // iStr = iStr.replace(/```/g, '');
        // console.log(newStr)
        try {
            let jsonString = JSON.parse(newStr);
            console.log(jsonString);
        } catch (error) {
            console.error("Parsing error:", error);
        }
        //let jsonString = JSON.parse(iStr);
        //console.log(jsonString)
        // let a = JSON.parse(`$iStr`)

        console.log("------------------------------------")
        //console.log(a)
 

        
        
        //myjson = JSON.parse(iStr);
        //console.log(jsonObject)
        //parseJsonArray(a);
        core.setOutput('jawapan', agileData);
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