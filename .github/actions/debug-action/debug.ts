import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    const creature = core.getInput('amazing-creature')
    if (creature === 'mosquito') {
      core.setFailed('Sorry, mosquitos are not amazing 🚫🦟')
      return
    }
    const pusherName = github.context.payload.pusher.name
    const message = `👋 Hello ${pusherName}! You are an amazing ${creature}! 🙌`
    core.debug(message)
    core.setOutput('amazing-message', message)

    const octokit: github.GitHub = new github.GitHub(process.env['GITHUB_TOKEN'] || '')
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    // (there should already be a check suite)
    const name = 'debug-check-run'
    // create a check run (is there one already?)
    const checkResponse = octokit.checks.create({
      owner,
      repo,
      name,
      head_sha: process.env['GITHUB_SHA'] || '',
    })
    console.log({checkResponse})

    // create an annotation with an action
  } catch (error) {
    core.setFailed(`Debug-action failure: ${error}`)
  }
}

run()

export default run
