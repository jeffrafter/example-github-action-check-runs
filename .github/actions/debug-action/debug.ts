import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    const octokit: github.GitHub = new github.GitHub(process.env['GITHUB_TOKEN'] || '')
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    
    console.log("😍😍😍😍😍😍😍😍😍😍😍😍")
    console.log("🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️")
    console.log("🤷‍♂️")
    
    console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
    console.log('\x1b[33m%s\x1b[0m', 'I am yellow');  //yellow

    Reset = "\x1b[0m"
    Bright = "\x1b[1m"
    Dim = "\x1b[2m"
    Underscore = "\x1b[4m"
    Blink = "\x1b[5m"
    Reverse = "\x1b[7m"
    Hidden = "\x1b[8m"

    FgBlack = "\x1b[30m"
    FgRed = "\x1b[31m"
    FgGreen = "\x1b[32m"
    FgYellow = "\x1b[33m"
    FgBlue = "\x1b[34m"
    FgMagenta = "\x1b[35m"
    FgCyan = "\x1b[36m"
    FgWhite = "\x1b[37m"

    BgBlack = "\x1b[40m"
    BgRed = "\x1b[41m"
    BgGreen = "\x1b[42m"
    BgYellow = "\x1b[43m"
    BgBlue = "\x1b[44m"
    BgMagenta = "\x1b[45m"
    BgCyan = "\x1b[46m"
    BgWhite = "\x1b[47m"
    
    console.log("Another")
    console.log("\033[31m this will be red \033[91m and this will be normal")
    
    console.log("" + BgGreen + " THIS IS ON GREEN")
    
    // Don't actually do anything
    return
    
    
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
