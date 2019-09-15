import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
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

    // There is already a check-run for this action and SHA in the suite
    const checkRunsResponse = await octokit.checks.listForSuite({
      owner,
      repo,
      check_name: 'Debug',
      check_suite_id: checkSuite.id,
    })
    const checkRun = checkRunsResponse.data.total_count === 1 && checkRunsResponse.data.check_runs[0]
    if (!checkRun) return

    // Log the check run
    console.log({checkRun})

    // Update it with a bunch of weird things
    await octokit.checks.update({
      owner,
      repo,
      details_url: 'https://rpl.cat',
      check_run_id: checkRun.id,
      output: {
        title: 'Cool title',
        summary: 'This is a :cool: **summary**!',
        text:
          'Hey friends! Welcome to the text that tells us everything about this check run. You deserve amazing thinigs and are a great person.',
        annotations: [
          {
            path: '.github/actions/debug-action/debug.ts',
            start_line: 1,
            end_line: 1,
            annotation_level: 'notice',
            message: 'Hey this section of the code is awesome',
            title: 'READ THIS IF YOU NOTICE',
          },
        ],
        images: [
          {
            alt: 'Give cats CPR',
            image_url: 'https://rpl.cat/images/mouth-to-cat.png',
          },
        ],
      },
      actions: [
        {
          label: 'Fix',
          identifier: 'fix_errors',
          description: 'Allow us to fix these errors for you',
        },
      ],
    })

    // Create another check run (even though there is one already)
    const name = 'debug-check-run'
    const checkResponse = await octokit.checks.create({
      owner,
      repo,
      name,
      head_sha: process.env['GITHUB_SHA'] || '',
    })
    console.log({checkResponse})
  } catch (error) {
    core.setFailed(`Debug-action failure: ${error}`)
  }
}

run()

export default run
