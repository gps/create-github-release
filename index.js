const core = require('@actions/core');
const github = require('@actions/github');
const env = process.env;
const fs = require('fs');

async function getRelease(octokit, owner, repo, tag) {
    try {
        return await octokit.repos.getReleaseByTag({
            owner,
            repo,
            tag,
        });
    } catch (error) {
        if (error.status == 404) {
            return null;
        }
        console.log(error);
    }
}

async function createRelease(octokit, owner, repo, tag_name) {
    return await octokit.repos.createRelease({
        owner,
        repo,
        tag_name,
    });
}

async function getUploadUrl(octokit, owner, repo, tag) {
    var release = await getRelease(octokit, owner, repo, tag);
    if (release === null) {
        release = await createRelease(octokit, owner, repo, tag);
    }
    return release.data.upload_url;
}

async function uploadAsset(octokit, uploadUrl, artifactPath) {
    const split = artifactPath.split("==>");
    const data = fs.readFileSync(split[0].trim());
    const name = split[1].trim();
    try {
        const url = uploadUrl + "?name=" + name;
        await octokit.request({
            method: "POST",
            url: url,
            headers: {
                "content-type": "application/octet-stream"
            },
            data: data,
            name: name
        });
    } catch (error) {
        core.error(error);
        core.setFailed(`Unable to upload release asset: ${artifactPath}`);
    }
}

async function run() {
    const token = core.getInput("GH_TOKEN");
    const octokit = new github.GitHub(token);
    const owner = env.GITHUB_REPOSITORY.split("/")[0];
    const repo = env.GITHUB_REPOSITORY.split("/")[1];
    const tag = core.getInput("TAG_NAME");
    const artifacts = core.getInput("ARTIFACTS").split("\n");

    const uploadUrl = await getUploadUrl(octokit, owner, repo, tag);

    for (let i = 0; i < artifacts.length; i++) {
        const artifact = artifacts[i];
        await uploadAsset(octokit, uploadUrl, artifact);
    }
}

run();
