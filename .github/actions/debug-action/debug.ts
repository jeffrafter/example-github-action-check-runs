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

    // A check-suite is already created for this SHA
    const listSuitesResponse = await octokit.checks.listSuitesForRef({
      owner,
      repo,
      ref: process.env['GITHUB_SHA'] || '',
    })
    listSuitesResponse.data.check_suites.forEach(suite => {
      console.log('>>>>>>>> SUITE')
      console.log({suite})
    })

    // create a check run (even though there is one already)
    const name = 'debug-check-run'
    const checkResponse = await octokit.checks.create({
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
