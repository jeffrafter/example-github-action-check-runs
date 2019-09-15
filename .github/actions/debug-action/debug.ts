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
    const checkSuite = listSuitesResponse.data.total_count === 1 && listSuitesResponse.data.check_suites[0]
    if (!checkSuite) return

    // There is already a check-run for this action
    const checkRunsResponse = await octokit.checks.listForSuite({
      owner,
      repo,
      check_name: 'Debug',
      check_suite_id: checkSuite.id,
    })
    const checkRun = checkRunsResponse.data.total_count === 1 && checkRunsResponse.data.check_runs[0]
    if (!checkRun) return
    console.log({checkRun})

    await octokit.checks.update({
      owner,
      repo,
      details_url: 'https://rpl.cat',
      check_run_id: checkRun.id,
      output: {
        title: 'Debug output title',
        summary: 'This is a :cool: **summary**!',
        // annotations: [
        //   {
        //     path: '.github/actions/debug-action/debug.ts',
        //     start_line: 1,
        //     end_line: 1,
        //     annotation_level: 'warning',
        //     message: 'Hey this section of the code is awesome',
        //     title: 'READ THIS IF YOU DARE',
        //   },
        // ],
        // images: [
        //   {
        //     alt: 'Give cats CPR',
        //     image_url: 'https://rpl.cat/images/mouth-to-cat.png',
        //   },
        // ],
      },
      // actions: [
      //   {
      //     label: 'Debug Anno Annotation',
      //     description: 'Do something to debug with this action',
      //     identifier: 'debug-anno-action',
      //   },
      // ],
    })

    // Update the check run to add text and images and annotations

    // create an annotation with an action

    // create a check run (even though there is one already)
    // const name = 'debug-check-run'
    // const checkResponse = await octokit.checks.create({
    //   owner,
    //   repo,
    //   name,
    //   head_sha: process.env['GITHUB_SHA'] || '',
    // })
    // console.log({checkResponse})
  } catch (error) {
    core.setFailed(`Debug-action failure: ${error}`)
  }
}

run()

export default run
